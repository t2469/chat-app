class RemoveIconUrlFromServers < ActiveRecord::Migration[7.1]
  def change
    remove_column :servers, :icon_url, :string
  end
end
