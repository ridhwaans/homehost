class ProcessingJobChannel < ApplicationCable::Channel
  def subscribed
    reject unless current_user.admin?
    stream_from "processing_jobs"
  end

  def self.broadcast(job)
    ActionCable.server.broadcast("processing_jobs", job.as_json)
  end
end
