package engine

import (
	"context"
	"testing"
)

func TestSendScanPathUnblocksWhenCancelled(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	if sendScanPath(ctx, make(chan string), "movie.mp4") {
		t.Fatal("expected cancelled path delivery to stop")
	}
}
