class CollectionItem < ApplicationRecord
  belongs_to :collection
  belongs_to :media_asset

  validates :media_asset_id, uniqueness: { scope: :collection_id }
  before_validation :assign_position, on: :create

  private

  def assign_position
    self.position ||= (collection.collection_items.maximum(:position) || -1) + 1
  end
end
