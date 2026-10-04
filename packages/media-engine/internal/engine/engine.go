package engine

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"mime"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/ridhwaans/homehost/packages/media-engine/internal/config"
)

var mediaExtensions = map[string]string{
	".flac": "audio", ".m4a": "audio", ".mp3": "audio", ".ogg": "audio", ".wav": "audio",
	".avi": "video", ".m4v": "video", ".mkv": "video", ".mov": "video", ".mp4": "video", ".webm": "video",
}

type Engine struct {
	cfg           config.Config
	logger        *slog.Logger
	client        *http.Client
	jobs          map[string]*Job
	assets        map[string]Asset
	cancel        map[string]context.CancelFunc
	mu            sync.RWMutex
	scanMu        sync.Mutex
	webhookEvents chan Event
	webhookCtx    context.Context
	webhookCancel context.CancelFunc
	sequence      atomic.Uint64
	metrics       metrics
}

func New(cfg config.Config, logger *slog.Logger) *Engine {
	_ = os.MkdirAll(cfg.TranscodeDir, 0o755)
	webhookCtx, webhookCancel := context.WithCancel(context.Background())
	engine := &Engine{
		cfg:           cfg,
		logger:        logger,
		client:        &http.Client{Timeout: 10 * time.Second},
		jobs:          make(map[string]*Job),
		assets:        make(map[string]Asset),
		cancel:        make(map[string]context.CancelFunc),
		webhookEvents: make(chan Event, 256),
		webhookCtx:    webhookCtx,
		webhookCancel: webhookCancel,
	}
	if cfg.WebhookURL != "" {
		go engine.deliverWebhooks()
	}
	return engine
}

func (e *Engine) Close() {
	e.webhookCancel()
	e.mu.Lock()
	defer e.mu.Unlock()
	for _, cancel := range e.cancel {
		cancel()
	}
}

func (e *Engine) Roots() []string {
	return slices.Clone(e.cfg.Roots)
}

func (e *Engine) StartScan(requestedRoots []string) (Job, error) {
	roots := e.cfg.Roots
	if len(requestedRoots) > 0 {
		roots = make([]string, 0, len(requestedRoots))
		for _, requested := range requestedRoots {
			path, _, err := resolveWithinRoots(requested, e.cfg.Roots)
			if err != nil {
				return Job{}, err
			}
			roots = append(roots, path)
		}
	}

	job, ctx := e.newJob("scan")
	e.metrics.scansStarted.Add(1)
	go e.scan(ctx, job.ID, roots)
	return job, nil
}

func (e *Engine) StartTranscode(request TranscodeRequest) (Job, error) {
	path, _, err := resolveWithinRoots(request.Path, e.cfg.Roots)
	if err != nil {
		return Job{}, err
	}
	if _, err := os.Stat(path); err != nil {
		return Job{}, err
	}

	job, ctx := e.newJob("transcode")
	e.metrics.transcodesStarted.Add(1)
	go e.transcode(ctx, job.ID, path, request)
	return job, nil
}

func (e *Engine) CancelJob(id string) bool {
	e.mu.RLock()
	cancel, ok := e.cancel[id]
	e.mu.RUnlock()
	if ok {
		cancel()
	}
	return ok
}

func (e *Engine) Job(id string) (Job, bool) {
	e.mu.RLock()
	defer e.mu.RUnlock()
	job, ok := e.jobs[id]
	if !ok {
		return Job{}, false
	}
	return cloneJob(*job), true
}

func (e *Engine) Jobs() []Job {
	e.mu.RLock()
	defer e.mu.RUnlock()
	result := make([]Job, 0, len(e.jobs))
	for _, job := range e.jobs {
		result = append(result, cloneJob(*job))
	}
	slices.SortFunc(result, func(a, b Job) int { return b.CreatedAt.Compare(a.CreatedAt) })
	return result
}

func (e *Engine) Asset(id string) (Asset, bool) {
	e.mu.RLock()
	defer e.mu.RUnlock()
	asset, ok := e.assets[id]
	return asset, ok
}

func (e *Engine) Assets() []Asset {
	e.mu.RLock()
	defer e.mu.RUnlock()
	result := make([]Asset, 0, len(e.assets))
	for _, asset := range e.assets {
		result = append(result, asset)
	}
	slices.SortFunc(result, func(a, b Asset) int { return strings.Compare(a.Path, b.Path) })
	return result
}

func (e *Engine) OpenMedia(path string) (*os.File, os.FileInfo, error) {
	path, _, err := resolveWithinRoots(path, e.cfg.Roots)
	if err != nil {
		return nil, nil, err
	}
	file, err := os.Open(path)
	if err != nil {
		return nil, nil, err
	}
	info, err := file.Stat()
	if err != nil {
		file.Close()
		return nil, nil, err
	}
	if !info.Mode().IsRegular() {
		file.Close()
		return nil, nil, fmt.Errorf("path is not a regular file")
	}
	return file, info, nil
}

func (e *Engine) HLSPath(jobID, name string) (string, error) {
	if filepath.Base(name) != name {
		return "", fmt.Errorf("invalid HLS filename")
	}
	job, ok := e.Job(jobID)
	if !ok || job.Type != "transcode" {
		return "", fmt.Errorf("transcode job not found")
	}
	return filepath.Join(e.cfg.TranscodeDir, jobID, name), nil
}

func (e *Engine) AddStreamedBytes(count int64) {
	if count > 0 {
		e.metrics.bytesStreamed.Add(uint64(count))
	}
}

func (e *Engine) Metrics() string {
	active := 0
	e.mu.RLock()
	for _, job := range e.jobs {
		if job.State == "queued" || job.State == "running" {
			active++
		}
	}
	e.mu.RUnlock()
	return e.metrics.render(active)
}

func (e *Engine) newJob(jobType string) (Job, context.Context) {
	id := strconv.FormatInt(time.Now().UnixMilli(), 36) + "-" + strconv.FormatUint(e.sequence.Add(1), 36)
	job := Job{ID: id, Type: jobType, State: "queued", CreatedAt: time.Now().UTC()}
	ctx, cancel := context.WithCancel(context.Background())
	e.mu.Lock()
	e.jobs[id] = &job
	e.cancel[id] = cancel
	e.mu.Unlock()
	e.emit(Event{Type: "job.queued", OccurredAt: time.Now().UTC(), Job: job})
	return job, ctx
}

func (e *Engine) scan(ctx context.Context, jobID string, roots []string) {
	e.scanMu.Lock()
	defer e.scanMu.Unlock()
	e.setRunning(jobID)
	paths := make(chan string)
	results := make(chan Asset)
	errorsFound := make(chan error, 1)
	var workers sync.WaitGroup

	for range e.cfg.Workers {
		workers.Add(1)
		go func() {
			defer workers.Done()
			for path := range paths {
				select {
				case <-ctx.Done():
					return
				default:
				}
				asset, err := e.inspect(ctx, path)
				if err != nil {
					e.logger.Warn("inspect failed", "path", path, "error", err)
					continue
				}
				results <- asset
			}
		}()
	}

	go func() {
		defer close(paths)
		for _, root := range roots {
			err := filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
				if err != nil {
					return err
				}
				if ctx.Err() != nil {
					return ctx.Err()
				}
				if entry.Type().IsRegular() && mediaExtensions[strings.ToLower(filepath.Ext(path))] != "" {
					paths <- path
				}
				return nil
			})
			if err != nil {
				errorsFound <- err
				return
			}
		}
	}()

	go func() {
		workers.Wait()
		close(results)
	}()

	count := 0
	seenPaths := make(map[string]struct{})
	for asset := range results {
		count++
		seenPaths[asset.Path] = struct{}{}
		e.mu.Lock()
		e.assets[asset.ID] = asset
		e.mu.Unlock()
		e.metrics.filesDiscovered.Add(1)
		job, _ := e.Job(jobID)
		e.emit(Event{Type: "asset.discovered", OccurredAt: time.Now().UTC(), Job: job, Asset: &asset})
	}

	select {
	case err := <-errorsFound:
		e.metrics.scansFailed.Add(1)
		e.finishJob(jobID, "failed", err, map[string]any{"assets": count})
	default:
		if ctx.Err() != nil {
			e.metrics.scansFailed.Add(1)
			e.finishJob(jobID, "cancelled", ctx.Err(), map[string]any{"assets": count})
			return
		}
		e.metrics.scansCompleted.Add(1)
		e.reconcileScanAssets(jobID, roots, seenPaths)
		e.finishJob(jobID, "completed", nil, map[string]any{"assets": count})
	}
}

func (e *Engine) reconcileScanAssets(jobID string, roots []string, seenPaths map[string]struct{}) {
	removed := make([]Asset, 0)
	e.mu.Lock()
	for id, asset := range e.assets {
		if pathWithinRoots(asset.Path, roots) {
			if _, found := seenPaths[asset.Path]; !found {
				removed = append(removed, asset)
				delete(e.assets, id)
			}
		}
	}
	e.mu.Unlock()

	job, _ := e.Job(jobID)
	for i := range removed {
		asset := removed[i]
		e.emit(Event{Type: "asset.missing", OccurredAt: time.Now().UTC(), Job: job, Asset: &asset})
	}
}

func pathWithinRoots(path string, roots []string) bool {
	for _, root := range roots {
		relative, err := filepath.Rel(root, path)
		if err == nil && relative != ".." && !strings.HasPrefix(relative, ".."+string(os.PathSeparator)) && !filepath.IsAbs(relative) {
			return true
		}
	}
	return false
}

func (e *Engine) inspect(ctx context.Context, path string) (Asset, error) {
	path, root, err := resolveWithinRoots(path, e.cfg.Roots)
	if err != nil {
		return Asset{}, err
	}
	info, err := os.Stat(path)
	if err != nil {
		return Asset{}, err
	}
	checksum, err := quickChecksum(path, info.Size())
	if err != nil {
		return Asset{}, err
	}
	return Asset{
		ID:         checksum,
		Path:       path,
		Root:       root,
		Kind:       mediaExtensions[strings.ToLower(filepath.Ext(path))],
		Size:       info.Size(),
		ModifiedAt: info.ModTime().UTC(),
		Checksum:   checksum,
		Probe:      runProbe(ctx, e.cfg.FFprobePath, path),
	}, nil
}

func quickChecksum(path string, size int64) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hash := sha256.New()
	_, _ = fmt.Fprintf(hash, "%d:", size)
	const sampleSize = 1024 * 1024
	if _, err := io.CopyN(hash, file, min(size, sampleSize)); err != nil && err != io.EOF {
		return "", err
	}
	if size > sampleSize {
		if _, err := file.Seek(max(0, size-sampleSize), io.SeekStart); err != nil {
			return "", err
		}
		if _, err := io.Copy(hash, file); err != nil {
			return "", err
		}
	}
	return hex.EncodeToString(hash.Sum(nil)), nil
}

func (e *Engine) transcode(ctx context.Context, jobID, path string, request TranscodeRequest) {
	e.setRunning(jobID)
	outputDir := filepath.Join(e.cfg.TranscodeDir, jobID)
	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		e.metrics.transcodesFailed.Add(1)
		e.finishJob(jobID, "failed", err, nil)
		return
	}

	height := request.VideoHeight
	if height == 0 {
		height = 720
	}
	videoBitrate := request.VideoBitrate
	if videoBitrate == "" {
		videoBitrate = "2500k"
	}
	audioBitrate := request.AudioBitrate
	if audioBitrate == "" {
		audioBitrate = "128k"
	}

	playlist := filepath.Join(outputDir, "index.m3u8")
	command := exec.CommandContext(ctx, e.cfg.FFmpegPath,
		"-y", "-i", path,
		"-map", "0:v:0", "-map", "0:a:0?",
		"-vf", fmt.Sprintf("scale=-2:%d", height),
		"-c:v", "libx264", "-preset", "veryfast", "-b:v", videoBitrate,
		"-c:a", "aac", "-b:a", audioBitrate,
		"-f", "hls", "-hls_time", "6", "-hls_playlist_type", "event",
		"-hls_segment_filename", filepath.Join(outputDir, "segment-%05d.ts"),
		playlist,
	)
	var stderr bytes.Buffer
	command.Stderr = &stderr
	if err := command.Run(); err != nil {
		e.metrics.transcodesFailed.Add(1)
		if ctx.Err() != nil {
			e.finishJob(jobID, "cancelled", ctx.Err(), nil)
		} else {
			e.finishJob(jobID, "failed", fmt.Errorf("%w: %s", err, tail(stderr.String(), 500)), nil)
		}
		return
	}

	e.metrics.transcodesCompleted.Add(1)
	e.finishJob(jobID, "completed", nil, map[string]any{
		"playlist": "/v1/hls/" + jobID + "/index.m3u8",
	})
}

func (e *Engine) setRunning(id string) {
	now := time.Now().UTC()
	e.mu.Lock()
	job := e.jobs[id]
	job.State = "running"
	job.StartedAt = &now
	snapshot := cloneJob(*job)
	e.mu.Unlock()
	e.emit(Event{Type: "job.running", OccurredAt: now, Job: snapshot})
}

func (e *Engine) finishJob(id, state string, err error, result map[string]any) {
	now := time.Now().UTC()
	e.mu.Lock()
	job := e.jobs[id]
	job.State = state
	job.FinishedAt = &now
	job.Progress = 100
	job.Result = result
	if err != nil {
		job.Error = err.Error()
	}
	delete(e.cancel, id)
	snapshot := cloneJob(*job)
	e.mu.Unlock()
	e.emit(Event{Type: "job." + state, OccurredAt: now, Job: snapshot})
}

func (e *Engine) emit(event Event) {
	if e.cfg.WebhookURL == "" {
		return
	}
	select {
	case e.webhookEvents <- event:
	case <-e.webhookCtx.Done():
	}
}

func (e *Engine) deliverWebhooks() {
	for {
		select {
		case <-e.webhookCtx.Done():
			return
		case event := <-e.webhookEvents:
			e.deliverWebhook(event)
		}
	}
}

func (e *Engine) deliverWebhook(event Event) {
	payload, err := json.Marshal(event)
	if err != nil {
		return
	}
	request, err := http.NewRequest(http.MethodPost, e.cfg.WebhookURL, bytes.NewReader(payload))
	if err != nil {
		return
	}
	request.Header.Set("Content-Type", "application/json")
	if e.cfg.WebhookToken != "" {
		request.Header.Set("Authorization", "Bearer "+e.cfg.WebhookToken)
	}
	response, err := e.client.Do(request)
	if err != nil {
		e.logger.Warn("webhook failed", "error", err)
		return
	}
	response.Body.Close()
}

func cloneJob(job Job) Job {
	if job.Result != nil {
		job.Result = mapsClone(job.Result)
	}
	return job
}

func mapsClone(source map[string]any) map[string]any {
	result := make(map[string]any, len(source))
	for key, value := range source {
		result[key] = value
	}
	return result
}

func ContentType(path string) string {
	if value := mime.TypeByExtension(strings.ToLower(filepath.Ext(path))); value != "" {
		return value
	}
	return "application/octet-stream"
}

func tail(value string, limit int) string {
	if len(value) <= limit {
		return value
	}
	return value[len(value)-limit:]
}
