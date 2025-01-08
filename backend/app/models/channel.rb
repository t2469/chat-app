class Channel < ApplicationRecord
  has_many :messages, dependent: :destroy
  validates :name, presence: true
end
