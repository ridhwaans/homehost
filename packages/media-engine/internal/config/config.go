package config

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
)

type Config struct {
	Address      string
	APIKey       string
	Roots        []string
	Workers      int
	FFprobePath  string
	FFmpegPath   string
	TranscodeDir string
	WebhookURL   string
	WebhookToken string
}

func FromEnv() (Config, error) {
	workers := runtime.NumCPU()
	if value := os.Getenv("MEDIA_ENGINE_WORKERS"); value != "" {
		parsed, err := strconv.Atoi(value)
		if err != nil || parsed < 1 {
			return Config{}, fmt.Errorf("MEDIA_ENGINE_WORKERS must be a positive integer")
		}
		workers = parsed
	}

	roots, err := cleanRoots(strings.Split(os.Getenv("MEDIA_ENGINE_ROOTS"), string(os.PathListSeparator)))
	if err != nil {
		return Config{}, err
	}
	if len(roots) == 0 {
		return Config{}, fmt.Errorf("MEDIA_ENGINE_ROOTS must contain at least one directory")
	}

	transcodeDir := valueOrDefault("MEDIA_ENGINE_TRANSCODE_DIR", filepath.Join(os.TempDir(), "homehost-transcodes"))
	transcodeDir, err = filepath.Abs(transcodeDir)
	if err != nil {
		return Config{}, fmt.Errorf("resolve transcode directory: %w", err)
	}

	return Config{
		Address:      valueOrDefault("MEDIA_ENGINE_ADDRESS", ":5100"),
		APIKey:       os.Getenv("MEDIA_ENGINE_API_KEY"),
		Roots:        roots,
		Workers:      workers,
		FFprobePath:  valueOrDefault("MEDIA_ENGINE_FFPROBE", "ffprobe"),
		FFmpegPath:   valueOrDefault("MEDIA_ENGINE_FFMPEG", "ffmpeg"),
		TranscodeDir: transcodeDir,
		WebhookURL:   os.Getenv("MEDIA_ENGINE_WEBHOOK_URL"),
		WebhookToken: os.Getenv("MEDIA_ENGINE_WEBHOOK_TOKEN"),
	}, nil
}

func cleanRoots(values []string) ([]string, error) {
	roots := make([]string, 0, len(values))
	for _, value := range values {
		if strings.TrimSpace(value) == "" {
			continue
		}
		root, err := filepath.Abs(value)
		if err != nil {
			return nil, fmt.Errorf("resolve media root %q: %w", value, err)
		}
		roots = append(roots, filepath.Clean(root))
	}
	return roots, nil
}

func valueOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
