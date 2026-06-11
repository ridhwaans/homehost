class AuditEvent < ApplicationRecord
  belongs_to :actor, polymorphic: true, optional: true
  belongs_to :auditable, polymorphic: true, optional: true

  validates :action, presence: true

  def self.record!(actor:, action:, auditable: nil, metadata: {})
    create!(actor: actor, action: action, auditable: auditable, metadata: metadata)
  end
end
