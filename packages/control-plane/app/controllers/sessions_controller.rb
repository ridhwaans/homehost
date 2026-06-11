class SessionsController < ApplicationController
  layout "signed_out"

  def new
    redirect_to dashboard_path if current_user
  end

  def create
    user = User.find_by(email: params[:email].to_s.strip.downcase)
    unless user
      flash.now[:alert] = "No account exists for that email."
      return render :new, status: :unprocessable_entity
    end

    reset_session
    session[:user_id] = user.id
    AuditEvent.record!(actor: user, action: "session.started")
    redirect_to dashboard_path, notice: "Signed in as #{user.email}."
  end

  def destroy
    AuditEvent.record!(actor: current_user, action: "session.ended") if current_user
    reset_session
    redirect_to new_login_path, notice: "Signed out."
  end
end
