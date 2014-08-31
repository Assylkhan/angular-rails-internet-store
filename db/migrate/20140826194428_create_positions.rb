class CreatePositions < ActiveRecord::Migration
  def change
    create_table :positions do |t|
      t.integer :order_id
      t.integer :item_id
      t.integer :quantity
      t.timestamps
    end
  end
end
