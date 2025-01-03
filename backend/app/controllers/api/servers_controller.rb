module Api
  class Api::ServersController < ApplicationController
    def index
      servers = current_user.servers
      render json: servers
    end

    def create
      server = Server.new(server_params)
      if server.save
        ServerMember.create(server:server, user: current_user, role: 'owner')
        render json: server, status: :created
      else
        render json: {errors: server.errors.full_message}, status: :unprocessable_entity
      end
    end

    private
    def server_params
      params.require(:server).permit(:name, :icon_url)
    end
  end
end
