class CollectionsController < ApplicationController
  before_action :authenticate!

  def index
    @collections = selected_profile.collections.includes(:media_assets).order(:name)
  end

  def show
    @collection = selected_profile.collections.find(params[:id])
    @available_assets = MediaAsset.where.not(id: @collection.media_asset_ids).order(modified_at: :desc).limit(100)
  end

  def create
    collection = selected_profile.collections.create!(params.permit(:name, :description))
    AuditEvent.record!(actor: current_user, action: "collection.created", auditable: collection)
    redirect_to collection_path(collection, profile_id: selected_profile.id), notice: "Collection created."
  end

  def destroy
    collection = selected_profile.collections.find(params[:id])
    AuditEvent.record!(actor: current_user, action: "collection.deleted", auditable: collection)
    collection.destroy!
    redirect_to collections_path(profile_id: selected_profile.id), notice: "Collection deleted."
  end
end
