class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user
  has_one_attached :image
  serialize :pictures_url, coder: JSON
end
