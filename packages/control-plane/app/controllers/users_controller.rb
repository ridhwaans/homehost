class UsersController < ApplicationController
  before_action :authenticate!
  before_action :require_admin!

  def index
    @users = User.includes(:profiles).order(:email)
  end

  def create
    user = User.create!(email: params.require(:email), admin: params[:admin] == "1")
    user.profiles.create!(name: "Default")
    AuditEvent.record!(actor: current_user, action: "user.created", auditable: user)
    redirect_to users_path, notice: "Account created."
  end

  def destroy
    user = User.find(params[:id])
    if user == current_user
      return redirect_to users_path, alert: "You cannot delete the account currently in use."
    end

    AuditEvent.record!(actor: current_user, action: "user.deleted", auditable: user)
    user.destroy!
    redirect_to users_path, notice: "Account deleted."
  end
end
