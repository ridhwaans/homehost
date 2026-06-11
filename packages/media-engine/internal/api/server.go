package api

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/ridhwaans/homehost/packages/media-engine/internal/engine"
)

type server struct {
	engine *engine.Engine
	apiKey string
	logger *slog.Logger
}

func New(mediaEngine *engine.Engine, apiKey string, logger *slog.Logger) http.Handler {
	s := &server{engine: mediaEngine, apiKey: apiKey, logger: logger}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health/live", s.live)
	mux.HandleFunc("GET /health/ready", s.ready)
	mux.HandleFunc("GET /metrics", s.metrics)
	mux.HandleFunc("GET /v1/roots", s.roots)
	mux.HandleFunc("POST /v1/scans", s.startScan)
	mux.HandleFunc("GET /v1/jobs", s.jobs)
	mux.HandleFunc("GET /v1/jobs/{id}", s.job)
	mux.HandleFunc("DELETE /v1/jobs/{id}", s.cancelJob)
	mux.HandleFunc("GET /v1/assets", s.assets)
	mux.HandleFunc("GET /v1/assets/{id}", s.asset)
	mux.HandleFunc("GET /v1/stream", s.stream)
	mux.HandleFunc("POST /v1/transcodes", s.startTranscode)
	mux.HandleFunc("GET /v1/hls/{job}/{name}", s.hls)
	return s.logging(s.auth(mux))
}

func (s *server) live(response http.ResponseWriter, _ *http.Request) {
	writeJSON(response, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *server) ready(response http.ResponseWriter, _ *http.Request) {
	for _, root := range s.engine.Roots() {
		if info, err := os.Stat(root); err != nil || !info.IsDir() {
			writeJSON(response, http.StatusServiceUnavailable, map[string]string{
				"status": "not_ready", "root": root,
			})
			return
		}
	}
	writeJSON(response, http.StatusOK, map[string]string{"status": "ready"})
}

func (s *server) metrics(response http.ResponseWriter, _ *http.Request) {
	response.Header().Set("Content-Type", "text/plain; version=0.0.4")
	_, _ = io.WriteString(response, s.engine.Metrics())
}

func (s *server) roots(response http.ResponseWriter, _ *http.Request) {
	writeJSON(response, http.StatusOK, map[string]any{"roots": s.engine.Roots()})
}

func (s *server) startScan(response http.ResponseWriter, request *http.Request) {
	var input struct {
		Roots []string `json:"roots"`
	}
	if err := decodeJSON(request, &input); err != nil {
		writeError(response, http.StatusBadRequest, err)
		return
	}
	job, err := s.engine.StartScan(input.Roots)
	if err != nil {
		writeError(response, http.StatusUnprocessableEntity, err)
		return
	}
	writeJSON(response, http.StatusAccepted, job)
}

func (s *server) jobs(response http.ResponseWriter, _ *http.Request) {
	writeJSON(response, http.StatusOK, map[string]any{"jobs": s.engine.Jobs()})
}

func (s *server) job(response http.ResponseWriter, request *http.Request) {
	job, ok := s.engine.Job(request.PathValue("id"))
	if !ok {
		writeErrorMessage(response, http.StatusNotFound, "job not found")
		return
	}
	writeJSON(response, http.StatusOK, job)
}

func (s *server) cancelJob(response http.ResponseWriter, request *http.Request) {
	if !s.engine.CancelJob(request.PathValue("id")) {
		writeErrorMessage(response, http.StatusNotFound, "active job not found")
		return
	}
	response.WriteHeader(http.StatusNoContent)
}

func (s *server) assets(response http.ResponseWriter, _ *http.Request) {
	writeJSON(response, http.StatusOK, map[string]any{"assets": s.engine.Assets()})
}

func (s *server) asset(response http.ResponseWriter, request *http.Request) {
	asset, ok := s.engine.Asset(request.PathValue("id"))
	if !ok {
		writeErrorMessage(response, http.StatusNotFound, "asset not found")
		return
	}
	writeJSON(response, http.StatusOK, asset)
}

func (s *server) stream(response http.ResponseWriter, request *http.Request) {
	file, info, err := s.engine.OpenMedia(request.URL.Query().Get("path"))
	if err != nil {
		writeError(response, http.StatusNotFound, err)
		return
	}
	defer file.Close()

	response.Header().Set("Content-Type", engine.ContentType(info.Name()))
	writer := &countingResponseWriter{ResponseWriter: response}
	http.ServeContent(writer, request, info.Name(), info.ModTime(), file)
	s.engine.AddStreamedBytes(writer.bytes)
}

func (s *server) startTranscode(response http.ResponseWriter, request *http.Request) {
	var input engine.TranscodeRequest
	if err := decodeJSON(request, &input); err != nil {
		writeError(response, http.StatusBadRequest, err)
		return
	}
	job, err := s.engine.StartTranscode(input)
	if err != nil {
		writeError(response, http.StatusUnprocessableEntity, err)
		return
	}
	writeJSON(response, http.StatusAccepted, job)
}

func (s *server) hls(response http.ResponseWriter, request *http.Request) {
	path, err := s.engine.HLSPath(request.PathValue("job"), request.PathValue("name"))
	if err != nil {
		writeError(response, http.StatusNotFound, err)
		return
	}
	response.Header().Set("Content-Type", engine.ContentType(path))
	http.ServeFile(response, request, path)
}

func (s *server) auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		if strings.HasPrefix(request.URL.Path, "/health/") || request.URL.Path == "/metrics" || s.apiKey == "" {
			next.ServeHTTP(response, request)
			return
		}
		if request.Header.Get("Authorization") != "Bearer "+s.apiKey {
			writeErrorMessage(response, http.StatusUnauthorized, "invalid API token")
			return
		}
		next.ServeHTTP(response, request)
	})
}

func (s *server) logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		started := time.Now()
		next.ServeHTTP(response, request)
		s.logger.Info("request", "method", request.Method, "path", request.URL.Path, "duration_ms", time.Since(started).Milliseconds())
	})
}

func decodeJSON(request *http.Request, target any) error {
	defer request.Body.Close()
	decoder := json.NewDecoder(io.LimitReader(request.Body, 1024*1024))
	decoder.DisallowUnknownFields()
	return decoder.Decode(target)
}

func writeJSON(response http.ResponseWriter, status int, value any) {
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(status)
	_ = json.NewEncoder(response).Encode(value)
}

func writeError(response http.ResponseWriter, status int, err error) {
	writeErrorMessage(response, status, err.Error())
}

func writeErrorMessage(response http.ResponseWriter, status int, message string) {
	writeJSON(response, status, map[string]string{"error": message})
}

type countingResponseWriter struct {
	http.ResponseWriter
	bytes int64
}

func (w *countingResponseWriter) Write(value []byte) (int, error) {
	count, err := w.ResponseWriter.Write(value)
	w.bytes += int64(count)
	return count, err
}
