class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  skip_forgery_protection if: -> { request.path.start_with?("/api/") }
  helper_method :current_user, :selected_profile

  private

  def authenticate!
    return if current_user

    respond_to do |format|
      format.html { redirect_to new_login_path, alert: "Choose an account to continue." }
      format.json { render json: { error: "login required" }, status: :unauthorized }
    end
  end

  def require_admin!
    return if current_user&.admin?

    respond_to do |format|
      format.html { redirect_to dashboard_path, alert: "Administrator access is required." }
      format.json { render json: { error: "administrator access required" }, status: :forbidden }
    end
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def current_profile
    @current_profile ||= current_user.profiles.find(params[:profile_id])
  end

  def selected_profile
    return unless current_user

    @selected_profile ||= current_user.profiles.find_by(id: params[:profile_id]) || current_user.profiles.order(:id).first
  end

  rescue_from ActiveRecord::RecordNotFound do
    respond_to do |format|
      format.html { redirect_to dashboard_path, alert: "Resource not found." }
      format.json { render json: { error: "resource not found" }, status: :not_found }
    end
  end

  rescue_from ActiveRecord::RecordInvalid do |error|
    respond_to do |format|
      format.html { redirect_back fallback_location: dashboard_path, alert: error.record.errors.full_messages.to_sentence }
      format.json { render json: { errors: error.record.errors.full_messages }, status: :unprocessable_entity }
    end
  end
end
