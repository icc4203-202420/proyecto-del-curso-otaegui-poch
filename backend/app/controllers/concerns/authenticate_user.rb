module Authenticable
  extend ActiveSupport::Concern
  

  included do
    before_action :verify_jwt_token
  end

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    return if token.blank?

    decoded_token = JwtService.decode(token)
    @current_user = User.find_by(id: decoded_token[:user_id]) if decoded_token
  rescue StandardError
    @current_user = nil
  end

  def current_user
    @current_user
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end