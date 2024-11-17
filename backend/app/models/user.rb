class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
    :recoverable, :validatable, 
    :jwt_authenticatable, 
    jwt_revocation_strategy: self

  validates :first_name, :last_name, presence: true, length: { minimum: 2 }
  validates :email, presence: true, email: true
  validates :password, presence: true
  validates :handle, presence: true, uniqueness: true, length: { minimum: 3 }

  has_many :reviews
  has_many :beers, through: :reviews
  has_one :address, dependent: :destroy

  has_many :attendances
  has_many :events, through: :attendances
  has_many :friendships
  has_many :bars

  accepts_nested_attributes_for :reviews, :address, allow_destroy: true

  # Amistades iniciadas por el usuario
  has_many :friendships
  has_many :friends, through: :friendships, source: :friend

  # Amistades donde el usuario es el amigo añadido
  has_many :inverse_friendships, class_name: 'Friendship', foreign_key: 'friend_id'
  has_many :inverse_friends, through: :inverse_friendships, source: :user  

  def generate_jwt
    JWT.encode({ id: self.id, exp: 60.days.from_now.to_i }, Rails.application.credentials.devise_jwt_secret_key, 'HS256')
  end  
end
