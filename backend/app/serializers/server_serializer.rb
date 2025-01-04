class ServerSerializer < ActiveModel::Serializer
  attributes :id, :name, :icon_url, :is_member

  def is_member
    object.users.include?(scope)
  end
end