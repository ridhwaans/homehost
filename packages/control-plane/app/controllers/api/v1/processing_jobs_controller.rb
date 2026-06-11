module Api
  module V1
    class ProcessingJobsController < ApplicationController
      before_action :authenticate!
      before_action :require_admin!

      def index
        render json: ProcessingJob.order(created_at: :desc).limit(100)
      end

      def show
        render json: ProcessingJob.find(params[:id])
      end

      def create
        remote_job = create_remote_job
        job = ProcessingJob.find_or_initialize_by(engine_job_id: remote_job.fetch("id"))
        job.assign_attributes(
          job_type: remote_job.fetch("type"),
          state: remote_job.fetch("state"),
          progress: remote_job.fetch("progress", 0),
          requested_by: current_user,
          request_payload: job_params.to_h
        )
        job.save!
        AuditEvent.record!(actor: current_user, action: "processing_job.created", auditable: job)
        ProcessingJobChannel.broadcast(job)
        RefreshProcessingJobJob.set(wait: 2.seconds).perform_later(job.id)
        render json: job, status: :accepted
      rescue MediaEngineClient::Error => error
        render json: { error: error.message }, status: :bad_gateway
      end

      private

      def create_remote_job
        case job_params.require(:job_type)
        when "scan"
          MediaEngineClient.new.start_scan(roots: job_params[:roots] || [])
        when "transcode"
          MediaEngineClient.new.start_transcode(
            path: job_params.require(:path),
            video_height: job_params[:video_height]
          )
        else
          raise ActionController::BadRequest, "job_type must be scan or transcode"
        end
      end

      def job_params
        params.permit(:job_type, :path, :video_height, roots: [])
      end
    end
  end
end
