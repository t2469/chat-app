class ApplicationController < ActionController::API
  before_action :authenticate_request

  private

  def authenticate_request
    token = request.headers['Authorization']&.split(' ')&.last
    Rails.logger.debug("Token from header: #{token}")

    if token && (decoded_token = decode_jwt(token))
      Rails.logger.debug("Decoded Token: #{decoded_token}")
      @current_user = User.find(decoded_token[:user_id])
    else
      Rails.logger.debug("Authentication failed or token missing")
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  rescue ActiveRecord::RecordNotFound
    Rails.logger.debug("User not found for ID: #{decoded_token[:user_id]}")
    render json: { error: 'User not found' }, status: :not_found
  end


  def valid_token?(token)
    decoded = decode_jwt(token)
    if decoded && decoded[:user_id]
      true
    else
      false
    end
  rescue
    false
  end

  def decode_jwt(token)
    JWT.decode(token, ENV['JWT_SECRET_KEY'], true, algorithm: 'HS256')[0].with_indifferent_access
  end

  def current_user
    @current_user
  end
end
