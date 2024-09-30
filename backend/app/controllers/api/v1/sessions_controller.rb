class API::V1::SessionsController < Devise::SessionsController
  include ::RackSessionsFix
  respond_to :json
  # skip_before_action :authenticate_user!, only: [:create]

  # def create
  #   puts "Intentando iniciar sesión con email: #{params[:email]}"

  #   user = User.find_for_database_authentication(email: params[:email])
    
  #   if user && user.authenticate(params[:password])
  #     token = encode_token(user_id: user.id)
  #     render json: { token: token }, status: :created
  #   else
  #     render json: { error: 'Credenciales inválidas' }, status: :unauthorized
  #   end
  # end

  def create
    user = User.find_for_database_authentication(email: params[:email])
    if user&.valid_password?(params[:password])
      token = user.generate_jwt # Asegúrate de tener este método en tu modelo User
      render json: {
        status: {
          code: 200,
          message: 'Logged in successfully.',
          data: {
            user: UserSerializer.new(user).serializable_hash[:data][:attributes],
            token: token
          }
        }
      }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end
  
  private
  
  def respond_with(current_user, _opts = {})
    token = current_user.generate_jwt
    render json: {
      status: { 
        code: 200, 
        message: 'Logged in successfully.',
        data: {
          user: UserSerializer.new(current_user).serializable_hash[:data][:attributes],
          token: token
        }
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      jwt_payload = JWT.decode(
        request.headers['Authorization'].split(' ').last,
        Rails.application.credentials.devise_jwt_secret_key,
        true,
        { algorithm: 'HS256' }
      ).first
      current_user = User.find(jwt_payload['sub'])
    end
    
    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
