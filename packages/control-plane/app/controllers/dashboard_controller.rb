class DashboardController < ApplicationController
  before_action :authenticate!

  def show
    @asset_counts = MediaAsset.group(:kind).count
    @status_counts = MediaAsset.group(:status).count
    @job_counts = ProcessingJob.group(:state).count
    @recent_jobs = ProcessingJob.order(created_at: :desc).limit(6)
    @recent_assets = MediaAsset.order(modified_at: :desc).limit(6)
    @continue_watching = selected_profile&.playback_positions
      &.includes(:media_asset)
      &.where(completed: false)
      &.order(last_played_at: :desc)
      &.limit(6) || []
  end
end
