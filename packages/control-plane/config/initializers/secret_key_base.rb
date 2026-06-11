Rails.application.config.secret_key_base = ENV.fetch("SECRET_KEY_BASE") do
  "development-only-secret-key-base-" + ("0" * 64)
end
