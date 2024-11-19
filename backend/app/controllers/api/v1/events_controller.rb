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

      def feed
        # Busca las publicaciones más recientes asociadas a eventos y amistades del usuario.
        user = User.find(params[:user_id]) # Simulando el usuario actual para desarrollo
      
        # Encuentra eventos en los que haya participado el usuario o sus amistades
        friend_ids = user.friends.pluck(:id)
        relevant_user_ids = friend_ids << user.id
      
        # Selecciona publicaciones relacionadas con esos eventos
        event_posts = EventPicture
                        .joins(:event)
                        .where(user_id: relevant_user_ids)
                        .order(created_at: :desc)
      
        render json: event_posts, each_serializer: EventPostSerializer
      end
            


      # POST /api/v1/events/:id/upload_picture
      def upload_picture
        @event = Event.find_by(id: params[:id])

        if @event.nil?
          render json: { error: 'Evento no encontrado' }, status: :not_found
          return
        end

        # cambiar por el id del usuario actual Importante
        user_id = params[:user_id]

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


        # Crear una nueva instancia de EventPicture
        picture = @event.event_pictures.new(
          user_id: user.id,
          description: params[:description]
        )

        # Adjuntar la imagen utilizando ActiveStorage
        if params[:image].present?
          picture.image.attach(params[:image])
        else
          render json: { error: 'Imagen no proporcionada' }, status: :bad_request
          puts 'Imagen no proporcionada'
          return
        end

        # Agregar lógica para etiquetar amigos
        tagged_user_ids = params[:tagged_user_ids]
        if tagged_user_ids.present?
          # Almacenar los IDs de los usuarios etiquetados en el campo `users_tagged` del modelo `EventPicture`
          picture.users_tagged = tagged_user_ids
        end

        if picture.save
          # Generar y guardar la URL de la imagen
          picture.update(pictures_url: url_for(picture.image))
          render json: { success: 'Imagen subida con éxito', url: url_for(picture.image) }, status: :created
        else
          render json: { error: 'Error al guardar la imagen', messages: picture.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def pictures
        @event_pictures = EventPicture.where(event_id: params[:id])
        puts @event_pictures # Verificación de los registros recuperados
      
        # Si no hay imágenes, devolver un arreglo vacío
        if @event_pictures.blank?
          render json: []
          return
        end
      
        pictures_with_url = @event_pictures.map do |pic|
          # Asegurarse de que pictures_url siempre sea un array
          urls = pic.pictures_url.is_a?(String) ? [pic.pictures_url] : pic.pictures_url
      
          {
            id: pic.id,
            description: pic.description,
            pictures_url: urls.map { |url| url.start_with?('http') ? url : "#{request.base_url}#{url}" }, # Generar URLs absolutas
            users_tagged: users_tagged(pic)
          }
        end
      
        render json: pictures_with_url
      end
      
      def delete_picture
        @event = Event.find(params[:event_id])
        picture = @event.event_pictures.find_by(id: params[:id])
      
        if picture.nil?
          render json: { error: 'Imagen no encontrada' }, status: :not_found
          return
        end
      
        # Asegurarse de que el usuario actual es el propietario de la imagen
        user_id = params[:user_id]
        if picture.user_id != user_id
          render json: { error: 'No autorizado para eliminar esta imagen' }, status: :unauthorized
          return
        end

        # Eliminar la imagen
        picture.destroy
        render json: { success: 'Imagen eliminada con éxito' }, status: :ok
      end


      def users_tagged(event_pictures)
        puts event_pictures.description
      
        # Asegúrate de que users_tagged sea un array
        users_tagged_ids = event_pictures.users_tagged.is_a?(String) ? JSON.parse(event_pictures.users_tagged) : event_pictures.users_tagged
      
        if users_tagged_ids.present?
          users_tagged_ids.map do |user_id|
            user = User.find(user_id)
            user.as_json
          end
        else
          [] # Retorna un array vacío si no hay usuarios etiquetados
        end
      end
      
      def pictures_by_user
        user = User.find(params[:user_id])
        pictures = EventPicture.where(user_id: user.id)
        
        # Si no hay imágenes, devolver un arreglo vacío
        if pictures.blank?
          render json: []
          return
        end
        
        pictures_with_url = pictures.map do |pic|
          # Asegurarse de que pictures_url siempre sea un array
          urls = pic.pictures_url.is_a?(String) ? [pic.pictures_url] : pic.pictures_url
      
          {
            id: pic.id,
            description: pic.description,
            pictures_url: urls.map { |url| url.start_with?('http') ? url : "#{request.base_url}#{url}" }, # Generar URLs absolutas
            user_first_name: user.first_name # Agregar el primer nombre del usuario
          }
        end
        
        render json: pictures_with_url
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

  


