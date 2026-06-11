class ProcessingJob < ApplicationRecord
  belongs_to :requested_by, class_name: "User", optional: true, inverse_of: :processing_jobs

  validates :engine_job_id, :job_type, :state, presence: true
  validates :engine_job_id, uniqueness: true
  validates :job_type, inclusion: { in: %w[scan transcode] }
  validates :state, inclusion: { in: %w[queued running completed failed cancelled] }
  validates :progress, numericality: { only_integer: true, in: 0..100 }

  def terminal?
    state.in?(%w[completed failed cancelled])
  end
end
