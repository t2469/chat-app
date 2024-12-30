module Api
  class Api::UsersController < ApplicationController
    before_action :authenticate_request

    def show
      render json: current_user, status: :ok
    end
  end
end

