Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.force_ssl = ENV["FORCE_SSL"] == "true"
  config.public_file_server.enabled = true
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")
  config.log_tags = [:request_id]
  config.active_support.report_deprecations = false
  config.action_cable.allowed_request_origins = ENV.fetch("ALLOWED_ORIGINS", "").split(",")
end
