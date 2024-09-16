class Attendance < ApplicationRecord
  belongs_to :user
  belongs_to :event


  validates :user_id, presence: true
  validates :event_id, presence: true
  validates :checked_in, inclusion: { in: [true, false] }
  
  def check_in
    update(checked_in: true)
  end  
end
