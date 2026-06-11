module Api
  module V1
    class CollectionItemsController < ApplicationController
      before_action :authenticate!
      before_action :set_collection

      def create
        asset = MediaAsset.find(params[:media_asset_id])
        item = @collection.collection_items.create!(media_asset: asset)
        AuditEvent.record!(actor: current_user, action: "collection.item_added", auditable: @collection, metadata: { media_asset_id: asset.id })
        render json: item, status: :created
      end

      def destroy
        item = @collection.collection_items.find(params[:id])
        AuditEvent.record!(actor: current_user, action: "collection.item_removed", auditable: @collection, metadata: { media_asset_id: item.media_asset_id })
        item.destroy!
        head :no_content
      end

      private

      def set_collection
        @collection = current_profile.collections.find(params[:collection_id])
      end
    end
  end
end
