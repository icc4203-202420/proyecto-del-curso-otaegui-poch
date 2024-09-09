class RemoveImageFromEvents < ActiveRecord::Migration[7.1]
  def change
    remove_column :events, :image, :string
  end
end
