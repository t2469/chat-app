class CreateServers < ActiveRecord::Migration[7.1]
  def change
    create_table :servers do |t|
      t.string :name
      t.string :icon_url

      t.timestamps
    end
  end
end
