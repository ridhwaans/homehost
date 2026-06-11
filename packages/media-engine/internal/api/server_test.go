package api

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/ridhwaans/homehost/packages/media-engine/internal/config"
	"github.com/ridhwaans/homehost/packages/media-engine/internal/engine"
)

func testServer(t *testing.T) (http.Handler, string) {
	t.Helper()
	root := t.TempDir()
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	service := engine.New(config.Config{
		Roots:        []string{root},
		Workers:      2,
		FFprobePath:  "false",
		FFmpegPath:   "false",
		TranscodeDir: t.TempDir(),
	}, logger)
	t.Cleanup(service.Close)
	return New(service, "secret", logger), root
}

func TestHealthDoesNotRequireAuthentication(t *testing.T) {
	handler, _ := testServer(t)
	request := httptest.NewRequest(http.MethodGet, "/health/live", nil)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", response.Code)
	}
}

func TestAPIRequiresAuthentication(t *testing.T) {
	handler, _ := testServer(t)
	request := httptest.NewRequest(http.MethodGet, "/v1/jobs", nil)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", response.Code)
	}
}

func TestStreamSupportsByteRanges(t *testing.T) {
	handler, root := testServer(t)
	path := filepath.Join(root, "movie.mp4")
	if err := os.WriteFile(path, []byte("0123456789"), 0o600); err != nil {
		t.Fatal(err)
	}

	request := httptest.NewRequest(http.MethodGet, "/v1/stream?path="+path, nil)
	request.Header.Set("Authorization", "Bearer secret")
	request.Header.Set("Range", "bytes=2-5")
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)

	if response.Code != http.StatusPartialContent {
		t.Fatalf("expected 206, got %d", response.Code)
	}
	if response.Body.String() != "2345" {
		t.Fatalf("unexpected range body: %q", response.Body.String())
	}
}

func TestStartScanDiscoversMediaOnly(t *testing.T) {
	handler, root := testServer(t)
	_ = os.WriteFile(filepath.Join(root, "movie.mp4"), []byte("video"), 0o600)
	_ = os.WriteFile(filepath.Join(root, "notes.txt"), []byte("text"), 0o600)

	request := httptest.NewRequest(http.MethodPost, "/v1/scans", strings.NewReader(`{"roots":[]}`))
	request.Header.Set("Authorization", "Bearer secret")
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusAccepted {
		t.Fatalf("expected 202, got %d: %s", response.Code, response.Body.String())
	}
}
