class Collection < ApplicationRecord
  belongs_to :profile

  has_many :collection_items, -> { order(:position) }, dependent: :destroy
  has_many :media_assets, through: :collection_items

  validates :name, presence: true, uniqueness: { scope: :profile_id, case_sensitive: false }
end
