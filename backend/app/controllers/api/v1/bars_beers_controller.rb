# app/controllers/api/v1/bars_beers_controller.rb
module API
    module V1
      class BarsBeersController < ApplicationController
        # GET /api/v1/bars_beers
        def index
          if params[:beer_id]
            @bars = Bar.joins(:bars_beers).where(bars_beers: { beer_id: params[:beer_id] })
            render json: @bars
          else
            @bars = Bar.all
            render json: @bars
          end
        end
  
        # GET /api/v1/bars_beers/:id
        def show
          @bars_beer = BarsBeer.find(params[:id])
          render json: @bars_beer
        end
  
        # POST /api/v1/bars_beers
        def create
          @bars_beer = BarsBeer.new(bars_beer_params)
          if @bars_beer.save
            render json: @bars_beer, status: :created
          else
            render json: @bars_beer.errors, status: :unprocessable_entity
          end
        end
  
        # DELETE /api/v1/bars_beers/:id
        def destroy
          @bars_beer = BarsBeer.find(params[:id])
          @bars_beer.destroy
          head :no_content
        end
  
        private
  
        def bars_beer_params
          params.require(:bars_beer).permit(:bar_id, :beer_id)
        end
      end
    end
  end
  