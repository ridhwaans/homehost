class ProcessingJobsController < ApplicationController
  before_action :authenticate!
  before_action :require_admin!, only: :create

  def index
    @processing_jobs = ProcessingJob.order(created_at: :desc).limit(200)
  end

  def show
    @processing_job = ProcessingJob.find(params[:id])
  end

  def create
    remote_job = case params.require(:job_type)
    when "scan"
      MediaEngineClient.new.start_scan(roots: [])
    when "transcode"
      MediaEngineClient.new.start_transcode(path: params.require(:path), video_height: params[:video_height].presence&.to_i)
    else
      raise ActionController::BadRequest, "Unknown job type"
    end

    job = ProcessingJob.find_or_initialize_by(engine_job_id: remote_job.fetch("id"))
    job.assign_attributes(
      job_type: remote_job.fetch("type"),
      state: remote_job.fetch("state"),
      progress: remote_job.fetch("progress", 0),
      requested_by: current_user,
      request_payload: params.permit(:job_type, :path, :video_height).to_h
    )
    job.save!
    AuditEvent.record!(actor: current_user, action: "processing_job.created", auditable: job)
    RefreshProcessingJobJob.set(wait: 2.seconds).perform_later(job.id)
    redirect_to processing_job_path(job), notice: "#{job.job_type.titleize} job started."
  rescue MediaEngineClient::Error => error
    redirect_to processing_jobs_path, alert: error.message
  end
end
