class ServerMember < ApplicationRecord
  belongs_to :user
  belongs_to :server
end
