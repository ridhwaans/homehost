class Profile < ApplicationRecord
  belongs_to :user

  has_many :playback_positions, dependent: :destroy
  has_many :collections, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :user_id, case_sensitive: false }
  validates :content_rating_limit, length: { maximum: 20 }, allow_blank: true
end
