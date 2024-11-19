module API
    module V1
      class PicturesController < ApplicationController
        def index
          event_id = params[:event_id]
          user_id = params[:user_id]
  
          # Filtra las imágenes por evento y usuario
          pictures = EventPicture.where(event_id: event_id, user_id: user_id)
  
          render json: { pictures: pictures }, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'No se encontraron imágenes para el evento o usuario' }, status: :not_found
        end
      end
    end
  end
  