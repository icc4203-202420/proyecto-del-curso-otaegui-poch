class API::V1::RegistrationsController < Devise::RegistrationsController
  include ::RackSessionsFix
  respond_to :json

  def create
    user = User.new(sign_up_params)
    if user.save
      render json:  { message: "Usuario registrado exitosamente", user: user }, status: :created
    else
      puts user.errors.full_messages
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(
      :email, :first_name, :last_name, :handle,
      :password, :password_confirmation,
      address_attributes: [:line1, :line2, :city, :country_id])
  end

  def respond_with(current_user, _opts = {})
    if resource.persisted?
      render json: {
        status: {code: 200, message: 'Signed up successfully.'},
        data: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
      }
    else
      render json: {
        status: {message: "User couldn't be created successfully. #{current_user.errors.full_messages.to_sentence}"},
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
end
