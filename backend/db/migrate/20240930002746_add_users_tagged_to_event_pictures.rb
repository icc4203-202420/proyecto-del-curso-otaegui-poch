class AddUsersTaggedToEventPictures < ActiveRecord::Migration[7.1]
  def change
    add_column :event_pictures, :users_tagged, :text
  end
end
