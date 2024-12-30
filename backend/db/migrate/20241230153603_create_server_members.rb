class CreateServerMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :server_members do |t|
      t.references :user, null: false, foreign_key: true
      t.references :server, null: false, foreign_key: true
      t.string :role

      t.timestamps
    end
  end
end
