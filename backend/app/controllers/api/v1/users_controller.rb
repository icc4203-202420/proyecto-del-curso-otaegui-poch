class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]
  before_action :authenticate_user!

  def index
    @users = User.includes(:reviews, :address).all   
  end

  def show
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
  
  def friendships
    friendships = @user.friendships
    friends = friendships.map { |f| User.find(f.friend_id) }
    render json: friends
  end  

  def create_friendship
    friend = User.find(params[:friend_id])
    
    if Friendship.create(user_id: @user.id, friend_id: friend.id)
      render json: { message: 'Amistad creada con éxito' }, status: :created
    else
      render json: { error: 'No se pudo crear la amistad' }, status: :unprocessable_entity
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
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end
