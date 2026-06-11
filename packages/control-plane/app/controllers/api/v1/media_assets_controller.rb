module Api
  module V1
    class MediaAssetsController < ApplicationController
      before_action :authenticate!

      def index
        scope = MediaAsset.order(modified_at: :desc)
        scope = scope.where(kind: params[:kind]) if params[:kind].present?
        scope = scope.where(status: params[:status]) if params[:status].present?
        render json: scope.limit(params.fetch(:limit, 100).to_i.clamp(1, 500))
      end

      def show
        render json: MediaAsset.find(params[:id])
      end
    end
  end
end
