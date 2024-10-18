class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [ :create]
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    @reviews = Review.where(beer_id: params[:beer_id]) # Filtra por beer_id
    render json: { reviews: @reviews }, status: :ok
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @user.reviews.build(review_params)
    if @review.save
      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_user
    if params[:review] && params[:review][:user_id]
      @user = User.find(params[:review][:user_id])
    elsif params[:user_id] # Podrías enviar el user_id directamente como parámetro en la URL
      @user = User.find(params[:user_id])
    else
      # Otra opción es obtener al usuario de la sesión o autenticación, según tu implementación
      @user = current_user # Por ejemplo, si tienes Devise o algún sistema de autenticación
    end
  
    render json: { error: "User not found" }, status: :not_found unless @user
  end

  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
end
