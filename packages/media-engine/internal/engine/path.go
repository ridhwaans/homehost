package engine

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func resolveWithinRoots(path string, roots []string) (string, string, error) {
	if path == "" {
		return "", "", fmt.Errorf("path is required")
	}
	absolute, err := filepath.Abs(path)
	if err != nil {
		return "", "", fmt.Errorf("resolve path: %w", err)
	}
	absolute = filepath.Clean(absolute)

	for _, root := range roots {
		relative, err := filepath.Rel(root, absolute)
		if err != nil {
			continue
		}
		if relative == "." || (relative != ".." && !strings.HasPrefix(relative, ".."+string(os.PathSeparator))) {
			return absolute, root, nil
		}
	}
	return "", "", fmt.Errorf("path is outside configured media roots")
}
