class CollectionItemsController < ApplicationController
  before_action :authenticate!

  def create
    collection = selected_profile.collections.find(params[:collection_id])
    asset = MediaAsset.find(params.require(:media_asset_id))
    collection.collection_items.create!(media_asset: asset)
    AuditEvent.record!(actor: current_user, action: "collection.item_added", auditable: collection, metadata: { media_asset_id: asset.id })
    redirect_to collection_path(collection, profile_id: selected_profile.id), notice: "Media added."
  end

  def destroy
    collection = selected_profile.collections.find(params[:collection_id])
    item = collection.collection_items.find(params[:id])
    AuditEvent.record!(actor: current_user, action: "collection.item_removed", auditable: collection, metadata: { media_asset_id: item.media_asset_id })
    item.destroy!
    redirect_to collection_path(collection, profile_id: selected_profile.id), notice: "Media removed."
  end
end
