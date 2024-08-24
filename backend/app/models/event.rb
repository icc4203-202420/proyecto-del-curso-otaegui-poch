class Event < ApplicationRecord
  belongs_to :bar

  validates :name, presence: true
  validates :date, presence: true
  validates :location, presence: true
  validates :bar_id, presence: true

  
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances

  #has_one_attached :flyer

  def thumbnail
    #flyer.variant(resize_to_limit: [200, nil]).processed
    "funcion desabilitada momentaneamente"
  end  
end
