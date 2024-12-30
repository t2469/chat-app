class Server < ApplicationRecord
  has_many :server_members, dependent: :destroy
  has_many :members, through: :server_members

  validates :name, presence: true
end
