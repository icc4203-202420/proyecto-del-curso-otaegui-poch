# app/services/jwt_service.rb
class JwtService
    SECRET_KEY = Rails.application.credentials.secret_key_base

    def self.encode(payload, exp = 24.hours.from_now)
      payload[:exp] = exp.to_i
      JWT.encode(payload, SECRET_KEY,, 'HS256')
    end
  
    def self.decode(token)
      begin
        decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })[0]
        HashWithIndifferentAccess.new(decoded)
      rescue JWT::DecodeError => e
        puts "Decode Error: #{e.message}"
        nil
      rescue StandardError => e
        puts "Error: #{e.message}"
        nil
      end
  end
  