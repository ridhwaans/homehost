# Go and Ruby Services

Homehost uses a polyglot control-plane/data-plane architecture:

```text
React or another client
          |
          v
Rails control plane (:5200)
  identities, profiles, collections, playback, audits, job orchestration
          |
          | authenticated JSON API
          v
Go media engine (:5100)
  discovery, ffprobe, range streaming, FFmpeg HLS, metrics
          |
          | authenticated webhooks
          +--------------------------> Rails + Action Cable
```

## Run Together

Set the media paths and secrets:

```sh
export MOVIES_PATH=/path/to/movies
export TV_PATH=/path/to/tv
export MUSIC_PATH=/path/to/music
export MEDIA_ENGINE_API_KEY="$(openssl rand -hex 32)"
export MEDIA_ENGINE_WEBHOOK_TOKEN="$(openssl rand -hex 32)"
export SECRET_KEY_BASE="$(openssl rand -hex 64)"
```

From `packages/`:

```sh
docker compose -f docker-compose.services.yml up --build
```
