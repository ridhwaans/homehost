package engine

import (
	"os"
	"path/filepath"
	"testing"
)

func TestResolveWithinRoots(t *testing.T) {
	root := t.TempDir()
	inside := filepath.Join(root, "movie.mp4")
	if err := os.WriteFile(inside, []byte("video"), 0o600); err != nil {
		t.Fatal(err)
	}

	resolved, matchedRoot, err := resolveWithinRoots(inside, []string{root})
	if err != nil {
		t.Fatalf("expected path to resolve: %v", err)
	}
	if resolved != inside || matchedRoot != root {
		t.Fatalf("unexpected resolution: %q, %q", resolved, matchedRoot)
	}

	if _, _, err := resolveWithinRoots(filepath.Join(root, "..", "secret"), []string{root}); err == nil {
		t.Fatal("expected traversal outside root to fail")
	}
}

func TestQuickChecksumChangesWithContent(t *testing.T) {
	path := filepath.Join(t.TempDir(), "track.mp3")
	if err := os.WriteFile(path, []byte("first"), 0o600); err != nil {
		t.Fatal(err)
	}
	first, err := quickChecksum(path, 5)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte("other"), 0o600); err != nil {
		t.Fatal(err)
	}
	second, err := quickChecksum(path, 5)
	if err != nil {
		t.Fatal(err)
	}
	if first == second {
		t.Fatal("expected checksum to reflect file content")
	}
}
