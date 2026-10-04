class EngineEventIngestor
  def initialize(payload)
    @payload = payload.deep_stringify_keys
  end

  def call
    ApplicationRecord.transaction do
      job = upsert_job
      asset = upsert_asset
      AuditEvent.record!(
        actor: nil,
        action: payload.fetch("type"),
        auditable: asset || job,
        metadata: { occurred_at: payload["occurred_at"] }
      )
      ProcessingJobChannel.broadcast(job) if job
    end
  end

  private

  attr_reader :payload

  def upsert_job
    attributes = payload["job"]
    return unless attributes

    job = ProcessingJob.find_or_initialize_by(engine_job_id: attributes.fetch("id"))
    job.assign_attributes(
      job_type: attributes.fetch("type"),
      state: attributes.fetch("state"),
      progress: attributes.fetch("progress", 0),
      error: attributes["error"],
      result: attributes["result"] || {},
      started_at: attributes["started_at"],
      finished_at: attributes["finished_at"]
    )
    job.save!
    job
  end

  def upsert_asset
    attributes = payload["asset"]
    return unless attributes

    if payload["type"] == "asset.missing"
      asset = MediaAsset.find_by(engine_id: attributes.fetch("id"))
      asset&.update!(status: "missing")
      return asset
    end

    asset = MediaAsset.find_or_initialize_by(engine_id: attributes.fetch("id"))
    asset.assign_attributes(
      path: attributes.fetch("path"),
      kind: attributes.fetch("kind"),
      checksum: attributes.fetch("checksum"),
      byte_size: attributes.fetch("size"),
      modified_at: attributes.fetch("modified_at"),
      status: "available",
      metadata: attributes.fetch("probe", {})
    )
    asset.save!
    asset
  end
end
