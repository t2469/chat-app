class Server < ApplicationRecord
  has_many :server_members, dependent: :destroy
  has_many :users, through: :server_members
  has_many :channels, dependent: :destroy

  validates :name, presence: true
end
