module Api
  module V1
    class ProfilesController < ApplicationController
      before_action :authenticate!
      before_action :set_profile, only: %i[update destroy]

      def index
        render json: current_user.profiles.order(:name)
      end

      def create
        profile = current_user.profiles.create!(profile_params)
        AuditEvent.record!(actor: current_user, action: "profile.created", auditable: profile)
        render json: profile, status: :created
      end

      def update
        @profile.update!(profile_params)
        AuditEvent.record!(actor: current_user, action: "profile.updated", auditable: @profile)
        render json: @profile
      end

      def destroy
        AuditEvent.record!(actor: current_user, action: "profile.deleted", auditable: @profile)
        @profile.destroy!
        head :no_content
      end

      private

      def set_profile
        @profile = current_user.profiles.find(params[:id])
      end

      def profile_params
        params.permit(:name, :content_rating_limit)
      end
    end
  end
end
