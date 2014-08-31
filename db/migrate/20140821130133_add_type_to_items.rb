class AddTypeToItems < ActiveRecord::Migration
  def change
    add_column :items, :view, :string
  end
end
