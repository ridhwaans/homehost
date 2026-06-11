ENV["RAILS_ENV"] ||= "test"
ENV["SECRET_KEY_BASE"] ||= "test-secret-key-base-" + ("0" * 64)

require_relative "../config/environment"
require "rails/test_help"

module AuthenticationHelper
  def sign_in_as(user)
    post login_path, params: { email: user.email }
    follow_redirect! if response.redirect?
  end
end

class ActiveSupport::TestCase
  parallelize(workers: 1)
end

class ActionDispatch::IntegrationTest
  include AuthenticationHelper
end
