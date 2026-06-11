class RefreshProcessingJobJob < ApplicationJob
  retry_on MediaEngineClient::Error, wait: :polynomially_longer, attempts: 5

  def perform(processing_job_id)
    processing_job = ProcessingJob.find(processing_job_id)
    return if processing_job.terminal?

    remote = MediaEngineClient.new.job(processing_job.engine_job_id)
    processing_job.update!(
      state: remote.fetch("state"),
      progress: remote.fetch("progress", 0),
      error: remote["error"],
      result: remote["result"] || {},
      started_at: remote["started_at"],
      finished_at: remote["finished_at"]
    )
    ProcessingJobChannel.broadcast(processing_job)
    self.class.set(wait: 2.seconds).perform_later(processing_job.id) unless processing_job.terminal?
  end
end
