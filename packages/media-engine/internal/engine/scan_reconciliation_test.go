package engine

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/ridhwaans/homehost/packages/media-engine/internal/config"
)

func TestSuccessfulScanRemovesMissingAssetsOnlyWithinScannedRoots(t *testing.T) {
	root := t.TempDir()
	otherRoot := t.TempDir()
	present := filepath.Join(root, "present.mp3")
	if err := os.WriteFile(present, []byte("audio"), 0o600); err != nil {
		t.Fatal(err)
	}

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	mediaEngine := New(config.Config{
		Roots:        []string{root, otherRoot},
		Workers:      1,
		FFprobePath:  "missing-ffprobe",
		TranscodeDir: t.TempDir(),
	}, logger)
	t.Cleanup(mediaEngine.Close)
	mediaEngine.assets["stale"] = Asset{ID: "stale", Path: filepath.Join(root, "gone.mp4")}
	mediaEngine.assets["outside"] = Asset{ID: "outside", Path: filepath.Join(otherRoot, "untouched.mp4")}

	job, ctx := mediaEngine.newJob("scan")
	mediaEngine.scan(ctx, job.ID, []string{root})

	if _, ok := mediaEngine.Asset("stale"); ok {
		t.Fatal("expected missing asset under scanned root to be removed")
	}
	if _, ok := mediaEngine.Asset("outside"); !ok {
		t.Fatal("expected asset outside scanned root to remain")
	}
	if len(mediaEngine.Assets()) != 2 {
		t.Fatalf("expected present and out-of-scope assets to remain, got %d", len(mediaEngine.Assets()))
	}
}

func TestWebhookEventsAreDeliveredInEnqueueOrder(t *testing.T) {
	received := make(chan string, 2)
	server := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		var event Event
		if err := json.NewDecoder(request.Body).Decode(&event); err != nil {
			t.Errorf("decode webhook event: %v", err)
		}
		received <- event.Type
		response.WriteHeader(http.StatusNoContent)
	}))
	defer server.Close()

	mediaEngine := New(config.Config{
		WebhookURL:   server.URL,
		TranscodeDir: t.TempDir(),
	}, slog.New(slog.NewTextHandler(io.Discard, nil)))
	defer mediaEngine.Close()
	mediaEngine.emit(Event{Type: "asset.missing"})
	mediaEngine.emit(Event{Type: "asset.discovered"})

	for _, expected := range []string{"asset.missing", "asset.discovered"} {
		select {
		case actual := <-received:
			if actual != expected {
				t.Fatalf("received %q, want %q", actual, expected)
			}
		case <-time.After(2 * time.Second):
			t.Fatalf("timed out waiting for %q webhook", expected)
		}
	}
}
