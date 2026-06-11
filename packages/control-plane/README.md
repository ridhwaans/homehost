# Homehost Control Plane

The control plane is Homehost's server-rendered Rails application for household
and operational state. It coordinates users, playback data, collections, and
media-processing jobs.

## Responsibilities

- passwordless email login backed by the Rails session cookie
- server-rendered dashboard, media, jobs, users, profiles, collections, and audit pages
- household profiles and content-rating preferences
- cross-device continue-watching state
- profile collections and ordered collection items
- scan and HLS transcode orchestration through the Go media engine
- webhook reconciliation for discovered assets and processing jobs
- Action Cable updates for administrator job monitoring
- polymorphic audit events for user and engine actions

## Setup

```sh
bundle install
bin/rails db:prepare
bin/rails db:seed
bin/rails server -p 5200
```

Copy `.env.example` into your process environment. The control plane and media
engine must share matching API and webhook tokens.

Open `http://localhost:5200/login` and enter the seeded administrator email,
`admin@homehost.local` by default.

## Pages

| Route | Purpose |
| --- | --- |
| `/dashboard` | library and processing overview |
| `/media` | filter and inspect discovered assets |
| `/jobs` | launch scans and inspect processing jobs |
| `/users` | administer passwordless household accounts |
| `/profiles` | manage playback profiles |
| `/collections` | curate profile-specific media lists |
| `/audit` | inspect user and media-engine activity |

## JSON API

JSON routes use the same signed-in Rails session as the browser application.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET/POST` | `/api/v1/users` | provision household accounts as an administrator |
| `GET/POST` | `/api/v1/profiles` | manage household profiles |
| `GET` | `/api/v1/media_assets` | inspect discovered media |
| `PUT` | `/api/v1/playback_positions/upsert` | persist playback progress |
| `GET/POST` | `/api/v1/collections` | manage profile collections |
| `POST` | `/api/v1/processing_jobs` | start a scan or transcode |
| `POST` | `/api/v1/media_engine/events` | authenticated engine webhook |
| `GET` | `/health/live` | process liveness |
| `GET` | `/health/ready` | database readiness |

Action Cable is mounted at `/cable` and uses the signed-in Rails session.

## Test

```sh
bin/rails db:test:prepare
bin/rails test
```
