module API
    module V1
      class BreweriesController < ApplicationController
        # Método para mostrar una cervecería específica
        def show
          brewery = Brewery.find(params[:id]) # Busca la cervecería por ID
          render json: brewery
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Brewery not found' }, status: :not_found
        end
  
        # Método para listar todas las cervecerías (opcional)
        def index
          breweries = Brewery.all
          render json: breweries
        end
  
        # Método para crear una nueva cervecería (opcional)
        def create
          brewery = Brewery.new(brewery_params)
          if brewery.save
            render json: brewery, status: :created
          else
            render json: { errors: brewery.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        # Método para actualizar una cervecería existente (opcional)
        def update
          brewery = Brewery.find(params[:id])
          if brewery.update(brewery_params)
            render json: brewery
          else
            render json: { errors: brewery.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        # Método para eliminar una cervecería (opcional)
        def destroy
          brewery = Brewery.find(params[:id])
          brewery.destroy
          head :no_content
        end
  
        private
  
        # Fuerte parámetros para la cervecería
        def brewery_params
          params.require(:brewery).permit(:name, :estdate) # Asegúrate de incluir aquí todos los atributos que necesites
        end
      end
    end
  end
  