module Api
  module V1
    class PlaybackPositionsController < ApplicationController
      before_action :authenticate!

      def index
        positions = current_profile.playback_positions
          .includes(:media_asset)
          .order(last_played_at: :desc)
          .limit(params.fetch(:limit, 50).to_i.clamp(1, 200))
        render json: positions.as_json(include: { media_asset: { only: %i[id engine_id kind metadata] } })
      end

      def upsert
        asset = MediaAsset.find(params[:media_asset_id])
        position = current_profile.playback_positions.find_or_initialize_by(media_asset: asset)
        position.update!(playback_params.merge(last_played_at: Time.current))
        AuditEvent.record!(
          actor: current_user,
          action: "playback.updated",
          auditable: position,
          metadata: { profile_id: current_profile.id, media_asset_id: asset.id }
        )
        render json: position
      end

      private

      def playback_params
        params.permit(:position_ms, :duration_ms, :completed)
      end
    end
  end
end
