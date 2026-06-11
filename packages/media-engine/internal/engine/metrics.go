package engine

import (
	"fmt"
	"strings"
	"sync/atomic"
)

type metrics struct {
	scansStarted        atomic.Uint64
	scansCompleted      atomic.Uint64
	scansFailed         atomic.Uint64
	filesDiscovered     atomic.Uint64
	bytesStreamed       atomic.Uint64
	transcodesStarted   atomic.Uint64
	transcodesCompleted atomic.Uint64
	transcodesFailed    atomic.Uint64
}

func (m *metrics) render(activeJobs int) string {
	values := []struct {
		name  string
		help  string
		value uint64
	}{
		{"homehost_media_scans_started_total", "Media scans started.", m.scansStarted.Load()},
		{"homehost_media_scans_completed_total", "Media scans completed.", m.scansCompleted.Load()},
		{"homehost_media_scans_failed_total", "Media scans failed.", m.scansFailed.Load()},
		{"homehost_media_files_discovered_total", "Media files discovered.", m.filesDiscovered.Load()},
		{"homehost_media_bytes_streamed_total", "Bytes served from media files.", m.bytesStreamed.Load()},
		{"homehost_media_transcodes_started_total", "HLS transcodes started.", m.transcodesStarted.Load()},
		{"homehost_media_transcodes_completed_total", "HLS transcodes completed.", m.transcodesCompleted.Load()},
		{"homehost_media_transcodes_failed_total", "HLS transcodes failed.", m.transcodesFailed.Load()},
	}

	var output strings.Builder
	for _, value := range values {
		fmt.Fprintf(&output, "# HELP %s %s\n# TYPE %s counter\n%s %d\n",
			value.name, value.help, value.name, value.name, value.value)
	}
	fmt.Fprintf(&output, "# HELP homehost_media_jobs_active Current queued or running jobs.\n")
	fmt.Fprintf(&output, "# TYPE homehost_media_jobs_active gauge\nhomehost_media_jobs_active %d\n", activeJobs)
	return output.String()
}
