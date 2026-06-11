class User < ApplicationRecord
  has_many :profiles, dependent: :destroy
  has_many :processing_jobs, foreign_key: :requested_by_id, dependent: :nullify, inverse_of: :requested_by

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
end
