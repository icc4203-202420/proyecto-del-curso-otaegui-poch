class MakeUserIdOptionalInAddresses < ActiveRecord::Migration[7.1]
  def change
    change_column_null :addresses, :user_id, true
  end
end
