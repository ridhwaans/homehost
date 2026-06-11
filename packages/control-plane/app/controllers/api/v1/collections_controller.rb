module Api
  module V1
    class CollectionsController < ApplicationController
      before_action :authenticate!
      before_action :set_collection, only: %i[show update destroy]

      def index
        render json: current_profile.collections.order(:name)
      end

      def show
        render json: @collection.as_json(include: { media_assets: { only: %i[id engine_id kind metadata] } })
      end

      def create
        collection = current_profile.collections.create!(collection_params)
        AuditEvent.record!(actor: current_user, action: "collection.created", auditable: collection)
        render json: collection, status: :created
      end

      def update
        @collection.update!(collection_params)
        AuditEvent.record!(actor: current_user, action: "collection.updated", auditable: @collection)
        render json: @collection
      end

      def destroy
        AuditEvent.record!(actor: current_user, action: "collection.deleted", auditable: @collection)
        @collection.destroy!
        head :no_content
      end

      private

      def set_collection
        @collection = current_profile.collections.find(params[:id])
      end

      def collection_params
        params.permit(:name, :description)
      end
    end
  end
end
