class API::V1::UsersController < ApplicationController
  #before_action :authenticate_user!, except: [:show, :index, :create]
  

  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships]

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])  # Esto puede variar dependiendo de cómo implementes la autenticación.
  end

  def index
    @users = User.all
    render json: @users
  end

  def show
    render json: @user, include: [:reviews, :address], status: :ok
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/users/:id/friendships
  def friendships
    friendships = Friendship.where(user_id: params[:id])  # Busca todas las amistades del usuario

    # Extrae los IDs de los amigos
    friend_ids = friendships.pluck(:friend_id)

    # Busca los detalles de los amigos
    friends = User.where(id: friend_ids)

    # Renderiza la respuesta en formato JSON
    render json: friends, status: :ok
  end

  def create_friendship
    Rails.logger.debug "Parameters: #{params.inspect}"
    user_id = params[:user_id]  # Asegúrate de usar `params[:user_id]` y no `params[:user]`

    # El resto de la lógica sigue igual
    friend_id = params[:id]
    existing_friendship = Friendship.find_by(user_id: user_id, friend_id: friend_id)

    if existing_friendship
        render json: { message: 'Ya son amigos' }, status: :ok
        return
    end

    friendship = Friendship.new(user_id: user_id, friend_id: friend_id)

    if friendship.save
        render json: { message: 'Amistad creada con éxito' }, status: :created
    else
        render json: { error: 'No se pudo crear la amistad' }, status: :unprocessable_entity
    end
  end
  
  

    # Eliminar una amistad
    def destroy_friendship
      # Encontrar al usuario que solicita eliminar la amistad
      user = User.find(params[:id])
      friend = User.find(params[:friend_id])
  
      # Eliminar la amistad de ambos usuarios (si existe)
      if user.friends.delete(friend) && friend.friends.delete(user)
        render json: { message: 'Amistad eliminada correctamente' }, status: :ok
      else
        render json: { error: 'No se pudo eliminar la amistad' }, status: :unprocessable_entity
      end
    end

  # Acción para obtener el feed del usuario
  def feed
    
  
    friend_ids = current_user.friends.pluck(:id)
    reviews = Review.where(user_id: [current_user.id, *friend_ids]).order(created_at: :desc)
    render json: reviews
  end

  def feed_reviews
    user = User.find(params[:id])
    friend_ids = user.friends.pluck(:id) # Asume que el modelo User tiene una relación de amigos
    reviews = Review.where(user_id: [user.id, *friend_ids]).order(created_at: :desc)
    render json: reviews
  end
  
  # GET /api/v1/users/search
  def search
    @users = User.where("handle ILIKE ?", "%#{params[:handle]}%")
    render json: { users: @users }, status: :ok
  end

  def update
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def pictures
    user = User.find(params[:id])
    pictures = user.event_pictures # Cambia esto según la asociación en tu modelo
    render json: pictures
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Usuario no encontrado' }, status: :not_found
  end

  private
  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    if token.nil? || !valid_token?(token)
      render json: { error: 'No autorizado' }, status: :unauthorized
    else
      @current_user = decode_token(token)
    end
  end
  def decoded_token
    # Aquí decodificamos el token y lo extraemos
    JWT.decode(request.headers['Authorization'].split(' ').last, Rails.application.secret_key_base).first
  rescue JWT::DecodeError
    nil
  end


  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(
      :first_name, :last_name, :email, :handle,
      :password, :password_confirmation
    )
  end
end
