class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :name
      t.float :real_price
      t.float :price
      t.string :description
      t.float :weight
      t.integer :count
      t.attachment :image

      t.timestamps
    end
  end
end
