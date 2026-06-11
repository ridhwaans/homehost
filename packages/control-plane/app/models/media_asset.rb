class MediaAsset < ApplicationRecord
  has_many :playback_positions, dependent: :destroy
  has_many :collection_items, dependent: :destroy
  has_many :collections, through: :collection_items

  validates :engine_id, :path, :kind, :status, presence: true
  validates :engine_id, :path, uniqueness: true
  validates :kind, inclusion: { in: %w[audio video] }
  validates :status, inclusion: { in: %w[available missing failed] }
end
