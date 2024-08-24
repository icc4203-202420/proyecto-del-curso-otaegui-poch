module API
  module V1
    class EventsController < ApplicationController
      before_action :set_event, only: %i[show update destroy]
      before_action :authenticate_user!, only: %i[create update destroy]

      # GET /api/v1/events
      def index
        @events = Event.all
        render json: @events
      end

      # GET /api/v1/events/:id
      def show
        render json: @event
      end

      # POST /api/v1/events
      def create
        @event = Event.new(event_params)
        if @event.save
          render json: { event: @event, message: "Image functionality is currently disabled." }, status: :created
        else
          render json: @event.errors, status: :unprocessable_entity
        end
      end
      
      

      # PATCH/PUT /api/v1/events/:id
      def update
        if @event.update(event_params)
          render json: @event
        else
          render json: @event.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/events/:id
      def destroy
        @event.destroy
        head :no_content
      end

      private

      # Método para encontrar el evento por ID
      def set_event
        @event = Event.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Event not found' }, status: :not_found
      end

      # Filtros permitidos para crear/actualizar eventos
      def event_params
        params.require(:event).permit(:name, :date, :location, :bar_id)#flyer desabilitado momentaneamente
      end

      # Método para autenticar al usuario
      def authenticate_user!
        # Este método debe ser implementado según tu sistema de autenticación.
        # Ejemplo: Devise
        # authenticate_user! o cualquier otro método de autenticación que uses.
      end
    end
  end
end

  

