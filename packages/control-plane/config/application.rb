require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module HomehostControlPlane
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = false
    config.active_job.queue_adapter = :async
    config.action_cable.disable_request_forgery_protection = true
    config.autoload_lib(ignore: %w[assets tasks])
  end
end
