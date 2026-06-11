require "net/http"

class MediaEngineClient
  class Error < StandardError; end

  def initialize(base_url: ENV.fetch("MEDIA_ENGINE_URL", "http://localhost:5100"), token: ENV["MEDIA_ENGINE_API_KEY"])
    @base_uri = URI(base_url)
    @token = token
  end

  def start_scan(roots:)
    post("/v1/scans", roots: roots)
  end

  def start_transcode(path:, video_height: nil)
    post("/v1/transcodes", { path: path, video_height: video_height }.compact)
  end

  def job(id)
    request(Net::HTTP::Get.new(path("/v1/jobs/#{CGI.escapeURIComponent(id)}")))
  end

  private

  attr_reader :base_uri, :token

  def post(endpoint, body)
    http_request = Net::HTTP::Post.new(path(endpoint))
    http_request["Content-Type"] = "application/json"
    http_request.body = JSON.generate(body)
    request(http_request)
  end

  def request(http_request)
    http_request["Authorization"] = "Bearer #{token}" if token.present?
    response = Net::HTTP.start(
      base_uri.host,
      base_uri.port,
      use_ssl: base_uri.scheme == "https",
      open_timeout: 3,
      read_timeout: 30
    ) { |http| http.request(http_request) }
    payload = JSON.parse(response.body.presence || "{}")
    return payload if response.is_a?(Net::HTTPSuccess)

    raise Error, "media engine returned #{response.code}: #{payload["error"] || response.message}"
  rescue JSON::ParserError, IOError, SystemCallError, Timeout::Error => error
    raise Error, "media engine request failed: #{error.message}"
  end

  def path(endpoint)
    base_path = base_uri.path.to_s.delete_suffix("/")
    "#{base_path}#{endpoint}"
  end
end
