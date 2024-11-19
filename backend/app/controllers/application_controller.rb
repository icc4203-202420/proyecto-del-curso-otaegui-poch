class ApplicationController < ActionController::API
  #before_action :authenticate_user!

  before_action :configure_permitted_parameters, if: :devise_controller?
  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name avatar])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name avatar])
  end

  def current_user
    # Decodificar el token y obtener el ID del usuario
    @current_user ||= User.find(decoded_token['user_id']) if decoded_token
  end
  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    decoded = decode_token(token)

    if decoded && User.exists?(decoded[:user_id])
      @current_user = User.find(decoded[:user_id])
    else
      render json: { error: 'No autorizado' }, status: :unauthorized
    end
  end

  private

  def encode_token(payload)
    # Genera el token JWT
    JWT.encode(payload, Rails.application.secrets.secret_key_base)
  end

  def decode_token(token)
    # Decodifica el token JWT
    return nil if token.nil?

    begin
      JWT.decode(token, Rails.application.secrets.secret_key_base)[0]
    rescue JWT::DecodeError
      nil
    end
  end
end