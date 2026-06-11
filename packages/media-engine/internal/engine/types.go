package engine

import "time"

type Asset struct {
	ID         string    `json:"id"`
	Path       string    `json:"path"`
	Root       string    `json:"root"`
	Kind       string    `json:"kind"`
	Size       int64     `json:"size"`
	ModifiedAt time.Time `json:"modified_at"`
	Checksum   string    `json:"checksum"`
	Probe      Probe     `json:"probe"`
}

type Probe struct {
	Format     string   `json:"format,omitempty"`
	DurationMS int64    `json:"duration_ms,omitempty"`
	BitRate    int64    `json:"bit_rate,omitempty"`
	Video      []Stream `json:"video,omitempty"`
	Audio      []Stream `json:"audio,omitempty"`
	Subtitles  []Stream `json:"subtitles,omitempty"`
	Error      string   `json:"error,omitempty"`
}

type Stream struct {
	Index       int    `json:"index"`
	Codec       string `json:"codec,omitempty"`
	Width       int    `json:"width,omitempty"`
	Height      int    `json:"height,omitempty"`
	Channels    int    `json:"channels,omitempty"`
	Language    string `json:"language,omitempty"`
	Disposition string `json:"disposition,omitempty"`
}

type Job struct {
	ID         string         `json:"id"`
	Type       string         `json:"type"`
	State      string         `json:"state"`
	CreatedAt  time.Time      `json:"created_at"`
	StartedAt  *time.Time     `json:"started_at,omitempty"`
	FinishedAt *time.Time     `json:"finished_at,omitempty"`
	Progress   int            `json:"progress"`
	Error      string         `json:"error,omitempty"`
	Result     map[string]any `json:"result,omitempty"`
}

type Event struct {
	Type       string    `json:"type"`
	OccurredAt time.Time `json:"occurred_at"`
	Job        Job       `json:"job"`
	Asset      *Asset    `json:"asset,omitempty"`
}

type TranscodeRequest struct {
	Path         string `json:"path"`
	VideoHeight  int    `json:"video_height,omitempty"`
	VideoBitrate string `json:"video_bitrate,omitempty"`
	AudioBitrate string `json:"audio_bitrate,omitempty"`
}
