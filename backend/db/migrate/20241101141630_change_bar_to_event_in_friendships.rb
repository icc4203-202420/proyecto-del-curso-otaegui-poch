class ChangeBarToEventInFriendships < ActiveRecord::Migration[7.1]
  def change
    # Eliminar la columna bar_id
    remove_reference :friendships, :bar, foreign_key: true

    # Agregar la columna event_id
    add_reference :friendships, :event, foreign_key: true, null: true
  end
end
