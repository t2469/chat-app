class ServerSerializer < ActiveModel::Serializer
  attributes :id, :name, :is_member

  def is_member
    object.users.include?(scope)
  end
end