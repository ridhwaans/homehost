module Api
  module V1
    module MediaEngine
      class EventsController < ActionController::API
        before_action :authenticate_webhook!

        def create
          EngineEventIngestor.new(params.to_unsafe_h).call
          head :accepted
        end

        private

        def authenticate_webhook!
          expected = ENV.fetch("MEDIA_ENGINE_WEBHOOK_TOKEN", "")
          supplied = request.headers.authorization.to_s.delete_prefix("Bearer ")
          valid = expected.present? &&
            supplied.bytesize == expected.bytesize &&
            ActiveSupport::SecurityUtils.secure_compare(supplied, expected)
          head :unauthorized unless valid
        end
      end
    end
  end
end
