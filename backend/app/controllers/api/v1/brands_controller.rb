# app/controllers/api/v1/brands_controller.rb
module API
    module V1
      class BrandsController < ApplicationController
        def show
          brand = Brand.find(params[:id])
          render json: brand
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Brand not found' }, status: :not_found
        end
  
        # Puedes agregar más métodos (index, create, update, destroy) si es necesario.
      end
    end
  end
  