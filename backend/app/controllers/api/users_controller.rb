module Api
  class Api::UsersController < ApplicationController
    before_action :authenticate_request

    def show
      render json: current_user, status: :ok
    end

    def destroy
      if current_user.destroy
        head :no_content
      else
        render json: { errors: current_user.errors }, status: :unprocessable_entity
      end
    end
  end
end

