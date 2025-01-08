class AddServerIdToChannels < ActiveRecord::Migration[7.1]
  def change
    add_reference :channels, :server, null: false, foreign_key: true
  end
end
