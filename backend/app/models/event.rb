class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances
  has_many :event_pictures, dependent: :destroy
  

  validates :name, presence: true
  validates :date, presence: true
  validates :bar_id, presence: true

  # Método para obtener la dirección del bar asociado
  def address
    bar.address
  end

  # Método para obtener la ubicación completa basada en la dirección del bar
  def full_location
    address ? "#{address.line1}, #{address.line2}, #{address.city}, #{address.country.name}" : "Location not available"
  end

  # Método para obtener el thumbnail del flyer, deshabilitado por ahora
  def thumbnail
    #flyer.variant(resize_to_limit: [200, nil]).processed
    "función deshabilitada momentáneamente"
  end
end
