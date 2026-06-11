class PlaybackPosition < ApplicationRecord
  belongs_to :profile
  belongs_to :media_asset

  validates :position_ms, :duration_ms, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :media_asset_id, uniqueness: { scope: :profile_id }
  validate :position_does_not_exceed_duration

  private

  def position_does_not_exceed_duration
    return unless position_ms && duration_ms && duration_ms.positive? && position_ms > duration_ms

    errors.add(:position_ms, "cannot exceed duration")
  end
end
