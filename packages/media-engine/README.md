# Homehost Media Engine

The media engine is Homehost's Go data plane for media discovery, inspection,
streaming, and transcoding.

## Responsibilities

- bounded concurrent media discovery
- `ffprobe` codec, duration, bitrate, and subtitle inspection
- rename-resistant sampled SHA-256 identifiers
- path-confined HTTP byte-range streaming
- cancellable asynchronous FFmpeg HLS transcodes
- webhook job and asset events
- liveness, readiness, JSON logs, and Prometheus metrics

## Run

Install FFmpeg, copy `.env.example` into your environment, then:

```sh
go run ./cmd/media-engine
```

All `/v1` routes require `Authorization: Bearer $MEDIA_ENGINE_API_KEY` when an
API key is configured. Health and metrics routes remain available to
orchestrators.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health/live` | process liveness |
| `GET` | `/health/ready` | configured root readiness |
| `GET` | `/metrics` | Prometheus metrics |
| `POST` | `/v1/scans` | start a scan |
| `GET` | `/v1/jobs` | list jobs |
| `DELETE` | `/v1/jobs/:id` | cancel an active job |
| `GET` | `/v1/assets` | list discovered assets |
| `GET` | `/v1/stream?path=...` | stream a confined media path |
| `POST` | `/v1/transcodes` | create an HLS transcode |
| `GET` | `/v1/hls/:job/:name` | serve a generated playlist or segment |

Start a scan:

```sh
curl -X POST http://localhost:5100/v1/scans \
  -H "Authorization: Bearer replace-me" \
  -H "Content-Type: application/json" \
  -d '{"roots":[]}'
```

Start a 720p HLS transcode:

```sh
curl -X POST http://localhost:5100/v1/transcodes \
  -H "Authorization: Bearer replace-me" \
  -H "Content-Type: application/json" \
  -d '{"path":"/media/movies/example.mkv","video_height":720}'
```

## Test

```sh
go test ./...
```
