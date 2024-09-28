module API
  module V1
    class EventsController < ApplicationController
      include ImageProcessing
      include Authenticable

      before_action :set_event, only: %i[show update destroy]
      before_action :verify_jwt_token, only: %i[create update destroy]

      #### probando


  skip_before_action :verify_jwt_token, only: [:check_in]
      # GET /api/v1/events
       # GET /api/v1/events
       def index
        events = Event.order(:date)
        render json: events
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
      
      def check_in
        event = Event.find(params[:id])
        attendance = Attendance.find_or_initialize_by(user: current_user, event: event)
    
        if attendance.update(checked_in: true)
          render json: { message: 'Checked in successfully' }, status: :ok
        else
          render json: { errors: attendance.errors.full_messages }, status: :unprocessable_entity
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


# POST /api/v1/events/:id/upload_picture
def upload_picture
  image_data = params[:image]
  decoded_image = decode_image(image_data)

  if decoded_image
    event_picture = @event.event_pictures.new(user: current_user, **decoded_image)

    if event_picture.save
      render json: event_picture, status: :created
    else
      render json: event_picture.errors, status: :unprocessable_entity
    end
  else
    render json: { error: 'Invalid image data' }, status: :unprocessable_entity
  end
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

  


