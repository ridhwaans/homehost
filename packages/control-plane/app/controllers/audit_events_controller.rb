class AuditEventsController < ApplicationController
  before_action :authenticate!
  before_action :require_admin!

  def index
    @audit_events = AuditEvent.includes(:actor, :auditable).order(created_at: :desc).limit(300)
  end
end
