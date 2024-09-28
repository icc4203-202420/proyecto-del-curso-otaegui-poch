class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]
  before_action :verify_jwt_token, only: [:update, :create_friendship]

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
      render json: @user.errors, status: :unprocessable_entity
    end
  end
  
  # GET /api/v1/users/:id/friendships

  def friendships
    friends = User.joins(:friendships)
                  .where(friendships: { user_id: @user.id })
                  .or(User.joins(:friendships)
                  .where(friendships: { friend_id: @user.id }))
                  .where.not(id: @user.id)
  
    if friends.any?
      render json: friends, status: :ok
    else
      render json: { error: "No friendships found for user with ID #{@user.id}" }, status: :not_found
    end
  end


  # POST /api/v1/users/:id/friendships

  def create_friendship
    friend = User.find_by(id: friendship_params[:friend_id])
    if friend
      friendship = @user.friendships.build(friend_id: friend.id, bar_id: friendship_params[:bar_id])
      if friendship.save
        render json: { message: 'Friendship created successfully' }, status: :created
      else
        render json: friendship.errors, status: :unprocessable_entity
      end
    else
      render json: { error: 'Friend not found' }, status: :not_found
    end
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

  def friendship_params
    params.require(:friendship).permit(:friend_id, :bar_id)
  end

  def authenticate_user!
    token = request.headers['Authorization']
    decoded_token = JsonWebToken.decode(token)

    @current_user = User.find(decoded_token[:user_id]) if decoded_token
    render json: { errors: ['Not Authenticated'] }, status: :unauthorized unless @current_user
  end
end
