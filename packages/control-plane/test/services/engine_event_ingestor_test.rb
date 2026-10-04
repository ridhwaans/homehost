require "test_helper"

class EngineEventIngestorTest < ActiveSupport::TestCase
  test "upserts a discovered asset and its scan job" do
    payload = {
      type: "asset.discovered",
      occurred_at: Time.current.iso8601,
      job: {
        id: "scan-1",
        type: "scan",
        state: "running",
        progress: 0
      },
      asset: {
        id: "asset-1",
        path: "/media/movie.mkv",
        kind: "video",
        checksum: "asset-1",
        size: 123,
        modified_at: Time.current.iso8601,
        probe: { format: "matroska", duration_ms: 10_000 }
      }
    }

    assert_difference ["MediaAsset.count", "ProcessingJob.count", "AuditEvent.count"], 1 do
      EngineEventIngestor.new(payload).call
    end

    assert_equal "matroska", MediaAsset.find_by!(engine_id: "asset-1").metadata["format"]
  end

  test "does not regress a terminal job from a delayed running event" do
    job = ProcessingJob.create!(
      engine_job_id: "scan-1",
      job_type: "scan",
      state: "completed",
      progress: 100
    )

    EngineEventIngestor.new({
      type: "asset.discovered",
      job: { id: "scan-1", type: "scan", state: "running", progress: 0 }
    }).call

    assert_equal "completed", job.reload.state
    assert_equal 100, job.progress
  end
end
