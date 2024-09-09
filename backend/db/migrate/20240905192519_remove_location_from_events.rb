class RemoveLocationFromEvents < ActiveRecord::Migration[7.1]
  def change
    remove_column :events, :location, :string
  end
end
