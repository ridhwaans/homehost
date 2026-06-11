FROM golang:1.24-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY cmd ./cmd
COPY internal ./internal
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /media-engine ./cmd/media-engine

FROM alpine:3.22
RUN apk add --no-cache ca-certificates ffmpeg
COPY --from=build /media-engine /usr/local/bin/media-engine
USER 65532:65532
EXPOSE 5100
ENTRYPOINT ["media-engine"]
