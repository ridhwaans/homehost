module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate!
      before_action :require_admin!
      before_action :set_user, only: %i[update destroy]

      def index
        render json: User.order(:email).as_json(only: %i[id email admin created_at])
      end

      def create
        user = User.create!(user_params)
        user.profiles.create!(name: "Default")
        AuditEvent.record!(actor: current_user, action: "user.created", auditable: user)
        render json: user.as_json(only: %i[id email admin created_at]), status: :created
      end

      def update
        @user.update!(user_params)
        AuditEvent.record!(actor: current_user, action: "user.updated", auditable: @user)
        render json: @user.as_json(only: %i[id email admin created_at])
      end

      def destroy
        if @user == current_user
          return render json: { error: "administrators cannot delete their current account" }, status: :unprocessable_entity
        end

        AuditEvent.record!(actor: current_user, action: "user.deleted", auditable: @user)
        @user.destroy!
        head :no_content
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.permit(:email, :admin)
      end
    end
  end
end
