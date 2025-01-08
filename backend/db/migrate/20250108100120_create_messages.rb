class CreateMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :messages do |t|
      t.text :content
      t.bigint :channel_id

      t.timestamps
    end
  end
end
