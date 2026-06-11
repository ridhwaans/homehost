class ProfilesController < ApplicationController
  before_action :authenticate!

  def index
    @profiles = current_user.profiles.order(:name)
  end

  def create
    profile = current_user.profiles.create!(profile_params)
    AuditEvent.record!(actor: current_user, action: "profile.created", auditable: profile)
    redirect_to profiles_path, notice: "Profile created."
  end

  def update
    profile = current_user.profiles.find(params[:id])
    profile.update!(profile_params)
    AuditEvent.record!(actor: current_user, action: "profile.updated", auditable: profile)
    redirect_to profiles_path, notice: "Profile updated."
  end

  def destroy
    profile = current_user.profiles.find(params[:id])
    if current_user.profiles.count == 1
      return redirect_to profiles_path, alert: "Keep at least one profile."
    end

    AuditEvent.record!(actor: current_user, action: "profile.deleted", auditable: profile)
    profile.destroy!
    redirect_to profiles_path, notice: "Profile deleted."
  end

  private

  def profile_params
    params.permit(:name, :content_rating_limit)
  end
end
