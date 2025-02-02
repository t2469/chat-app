module Api
  class Api::AuthenticationController < ApplicationController
    skip_before_action :authenticate_request, only: [:signup, :login]

    def signup
      user = User.new(user_params)
      if user.save
        token = encode_token(user_id: user.id)
        render json: { token: token, user: user }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def login
      user = User.find_by(username: params[:username])
      if user&.authenticate(params[:password])
        token = encode_token(user_id: user.id)
        render json: { token: token, user: user }, status: :ok
      else
        render json: { error: 'Invalid username or password' }, status: :unauthorized
      end
    end

    private
    def user_params
      params.require(:user).permit(:username, :password, :password_confirmation)
    end

    def encode_token(payload)
      JWT.encode(payload, ENV['JWT_SECRET_KEY'])
    end
  end
end
