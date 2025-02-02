class User < ApplicationRecord
  has_secure_password
  has_many :server_members, dependent: :destroy
  has_many :servers, through: :server_members
  has_many :messages, dependent: :destroy

  validates :username, presence: true, uniqueness: true
end
