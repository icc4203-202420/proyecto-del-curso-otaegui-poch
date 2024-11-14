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
    user_id = params[:id]  # Este es el ID del usuario cuyo amistades queremos obtener
    friendships = Friendship.where(user_id: user_id)  # Busca todas las amistades del usuario

    # Extrae los IDs de los amigos
    friend_ids = friendships.pluck(:friend_id)

    # Busca los detalles de los amigos
    friends = User.where(id: friend_ids)

    # Renderiza la respuesta en formato JSON
    render json: friends, status: :ok
  end

  def create_friendship
    friend_id = params[:id]        # ID del amigo que estás intentando agregar
    user_id = JSON.parse(request.body.read)['user_id']     # Este será el ID del usuario actual, pero proviene del cuerpo de la solicitud
  
    if user_id && friend_id
      # Crea la relación de amistad, asegurándote de que ambos IDs sean válidos
      Friendship.create(user_id: user_id, friend_id: friend_id)
      render json: { message: 'Amistad creada con éxito' }, status: :created
    else
      render json: { error: 'Faltan datos' }, status: :unprocessable_entity
    end
  end

    # Eliminar una amistad
  def destroy_friendship
    friend = User.find(params[:friend_id])
    if current_user.friends.destroy(friend)
      render json: { message: "Amistad eliminada exitosamente" }, status: :ok
    else
      render json: { error: "No se pudo eliminar la amistad" }, status: :unprocessable_entity
    end
  end

  # Acción para obtener el feed del usuario
  def feed
    # Obtener el usuario actual
    user = current_user

    # Obtener las publicaciones de las amistades
    friendships = user.friends

    # Obtener todas las publicaciones de las amistades, reseñas y fotos de los bares
    posts = []

    # Obtener publicaciones de las amistades
    friendships.each do |friend|
      posts += friend.posts # Suponiendo que existe un método `posts` en el modelo de `Friendship`
    end

    # Obtener publicaciones de los bares donde el usuario haya escrito algo
    user.bars.each do |bar|
      posts += bar.posts # Suponiendo que hay un modelo `Post` asociado a `Bar`
    end

    # Ordenar las publicaciones por fecha, de la más reciente a la más antigua
    posts.sort_by!(&:created_at).reverse!

    # Devolver las publicaciones en formato JSON
    render json: posts, each_serializer: EventPostSerializer
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

  private

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
