class MediaAssetsController < ApplicationController
  before_action :authenticate!

  def index
    @media_assets = MediaAsset.order(modified_at: :desc)
    @media_assets = @media_assets.where(kind: params[:kind]) if params[:kind].present?
    @media_assets = @media_assets.where(status: params[:status]) if params[:status].present?
    @media_assets = @media_assets.where("path LIKE ?", "%#{MediaAsset.sanitize_sql_like(params[:query])}%") if params[:query].present?
    @media_assets = @media_assets.limit(250)
  end

  def show
    @media_asset = MediaAsset.find(params[:id])
    @playback_position = selected_profile&.playback_positions&.find_by(media_asset: @media_asset)
  end
end
