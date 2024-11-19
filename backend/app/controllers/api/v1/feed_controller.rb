class FeedsController < ApplicationController
    #before_action :authenticate_user!
  
    def index
      # Obtenemos las reseñas del usuario actual y de sus amigos
      @reviews = Review.where(user_id: current_user.id)
                       .or(Review.where(user_id: current_user.friends.pluck(:id)))
                       .order(created_at: :desc)
    end
  end
  