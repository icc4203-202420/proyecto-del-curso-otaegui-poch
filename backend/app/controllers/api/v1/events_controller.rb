module API
  module V1
    class EventsController < ApplicationController
      include ImageProcessing
      include Authenticable

      before_action :set_event, only: %i[show update destroy]
      before_action :verify_jwt_token, only: %i[create update destroy upload_picture]

      #### probando


      skip_before_action :verify_jwt_token, only: %i[index show check_in upload_picture]
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
        attendance = Attendance.find_or_initialize_by(event: event, user_id: nil)
    
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
  @event = Event.find_by(id: params[:id])

  if @event.nil?
    render json: { error: 'Evento no encontrado' }, status: :not_found
    return
  end

  # cambiar por el id del usuario actual Importante
  user_id = 1

  # Verificar que el user_id esté presente
  if user_id.blank?
    render json: { error: 'ID de usuario no proporcionado' }, status: :bad_request
    return
  end

  # Verificar si el usuario existe
  user = User.find_by(id: user_id)
  if user.nil?
    render json: { error: 'Usuario no encontrado' }, status: :not_found
    return
  end

  # Crear la carpeta si no existe
  directory = Rails.root.join('public', 'seeds', 'images')
  FileUtils.mkdir_p(directory) unless File.directory?(directory)

  # Obtener el nombre original del archivo
  original_filename = params[:image].original_filename
  filepath = directory.join(original_filename)

  # Guardar la imagen en el sistema de archivos
  File.open(filepath, 'wb') do |file|
    file.write(params[:image].read)
  end

  # Crear una nueva instancia de EventPicture
  picture = @event.event_pictures.new(
    user_id: user.id,
    description: params[:description],
    pictures_url: ["/seeds/images/#{original_filename}"]
  )

  if picture.save
    render json: { success: 'Imagen subida con éxito', url: picture.pictures_url }, status: :ok
  else
    render json: { error: 'Error al guardar la imagen', messages: picture.errors.full_messages }, status: :unprocessable_entity
  end
end


def pictures
  @event_pictures = EventPicture.where(event_id: params[:id])
  pictures_with_url = @event_pictures.map do |pic|
    {
      id: pic.id,
      description: pic.description,
      pictures_url: pic.pictures_url.map { |url| "#{request.base_url}/#{url}" } # Generar URLs absolutas
    }
  end
  render json: pictures_with_url
end


    # POST /api/v1/event_pictures/:id/tag_user
def tag_user
  @event_picture = EventPicture.find_by(id: params[:picture_id])

  if @event_picture.nil?
    return render json: { error: "Event picture not found" }, status: :not_found
  end

  user_id = params[:user_id]

  # Inicializa el array de usuarios si es nulo
  @event_picture.users_tagged ||= []

  # Agrega el user_id al array de usuarios etiquetados
  @event_picture.users_tagged << user_id

  if @event_picture.save
    render json: @event_picture, status: :ok
  else
    render json: @event_picture.errors, status: :unprocessable_entity
  end
end

      private
      def current_user
        # Define aquí cómo obtener el usuario actual, por ejemplo, desde el token JWT
        @current_user ||= User.find_by(id: session[:user_id])
      end
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

  


