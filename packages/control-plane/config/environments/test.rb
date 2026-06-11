Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = false
  config.consider_all_requests_local = true
  config.action_controller.allow_forgery_protection = false
  config.active_support.deprecation = :stderr
  config.action_cable.allowed_request_origins = ["http://www.example.com"]
end
