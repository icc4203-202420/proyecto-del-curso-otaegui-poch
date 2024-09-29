class AddPicturesUrlToEventPictures < ActiveRecord::Migration[7.1]
  def change
    add_column :event_pictures, :pictures_url, :string
  end
end
