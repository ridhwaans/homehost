class HealthController < ActionController::API
  def live
    render json: { status: "ok" }
  end

  def ready
    ActiveRecord::Base.connection.execute("SELECT 1")
    render json: { status: "ready" }
  rescue ActiveRecord::ActiveRecordError => error
    render json: { status: "not_ready", error: error.message }, status: :service_unavailable
  end
end
