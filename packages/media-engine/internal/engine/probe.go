package engine

import (
	"context"
	"encoding/json"
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

type probeOutput struct {
	Format struct {
		FormatName string `json:"format_name"`
		Duration   string `json:"duration"`
		BitRate    string `json:"bit_rate"`
	} `json:"format"`
	Streams []struct {
		Index       int               `json:"index"`
		CodecName   string            `json:"codec_name"`
		CodecType   string            `json:"codec_type"`
		Width       int               `json:"width"`
		Height      int               `json:"height"`
		Channels    int               `json:"channels"`
		Tags        map[string]string `json:"tags"`
		Disposition map[string]int    `json:"disposition"`
	} `json:"streams"`
}

func runProbe(ctx context.Context, executable, path string) Probe {
	command := exec.CommandContext(ctx, executable,
		"-v", "error",
		"-show_format",
		"-show_streams",
		"-of", "json",
		path,
	)
	output, err := command.Output()
	if err != nil {
		return Probe{Error: fmt.Sprintf("ffprobe: %v", err)}
	}

	var raw probeOutput
	if err := json.Unmarshal(output, &raw); err != nil {
		return Probe{Error: fmt.Sprintf("decode ffprobe output: %v", err)}
	}

	duration, _ := strconv.ParseFloat(raw.Format.Duration, 64)
	bitRate, _ := strconv.ParseInt(raw.Format.BitRate, 10, 64)
	result := Probe{
		Format:     raw.Format.FormatName,
		DurationMS: int64(duration * 1000),
		BitRate:    bitRate,
	}
	for _, rawStream := range raw.Streams {
		dispositions := make([]string, 0)
		for name, enabled := range rawStream.Disposition {
			if enabled == 1 {
				dispositions = append(dispositions, name)
			}
		}
		stream := Stream{
			Index:       rawStream.Index,
			Codec:       rawStream.CodecName,
			Width:       rawStream.Width,
			Height:      rawStream.Height,
			Channels:    rawStream.Channels,
			Language:    rawStream.Tags["language"],
			Disposition: strings.Join(dispositions, ","),
		}
		switch rawStream.CodecType {
		case "video":
			result.Video = append(result.Video, stream)
		case "audio":
			result.Audio = append(result.Audio, stream)
		case "subtitle":
			result.Subtitles = append(result.Subtitles, stream)
		}
	}
	return result
}
