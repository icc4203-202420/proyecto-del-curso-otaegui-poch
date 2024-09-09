module API
  module V1
    class EventsController < ApplicationController
      include ImageProcessing
      include Authenticable

      before_action :set_event, only: %i[show update destroy]
      before_action :authenticate_user!, only: %i[create update destroy]

      # GET /api/v1/events
      def index
        bar = Bar.find(params[:bar_id])
        events = bar.events
        render json: events, status: :ok
      end

      # GET /api/v1/events/:id
      def show
        render json: @event
      end

      # POST /api/v1/events
      def create
        @event = Event.new(event_params)

        if @event.bar && @event.bar.address
          @event.address = @event.bar.address
        end

        if @event.save
          render json: @event, status: :created
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
        params.require(:event).permit(:name, :date, :bar_id)#flyer desabilitado momentaneamente
      end

      # Método para autenticar al usuario
      def authenticate_user!
        token = request.headers['Authorization']&.split(' ')&.last

        puts "Token recibido: #{token}"
        
        Rails.logger.debug("Token recibido: #{token}")
        
        if token.present?
          payload = JWT.decode(token, Rails.application.secrets.secret_key_base).first
          @current_user = User.find(payload['user_id'])

          puts "payload: #{payload}"
          Rails.logger.debug("user: #{@current_user}")


          
        else
          render json: { error: 'You need to sign in or sign up before continuing.' }, status: :unauthorized
        end
      end
    end
  end
end

  


