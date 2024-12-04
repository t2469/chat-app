module Api
  module V1
    class Api::V1::AuthenticationController < ApplicationController
      skip_before_action :authenticate_request, only: [:signup, :login]

      # def options
      #   headers['Access-Control-Allow-Origin'] = '*'
      #   headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
      #   headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
      #   head :ok
      # end

      # サインアップ
      def signup
        user = User.new(user_params)
        if user.save
          token = encode_token(user_id: user.id)
          render json: { token: token, user: user }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ログイン
      def login
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          token = encode_token(user_id: user.id)
          render json: { token: token, user: user }, status: :ok
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end


      private
      def user_params
        params.require(:user).permit(:username, :email, :password, :password_confirmation, :avatar_url)
      end

      def encode_token(payload)
        JWT.encode(payload, Rails.application.secrets.secret_key_base)
      end

    end
  end
end
