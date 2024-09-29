class AddImageUrlToEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :events, :image_url, :text
  end
end
