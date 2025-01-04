module Api
  class Api::ServersController < ApplicationController
    before_action :authenticate_request
    before_action :set_server, only: [:join, :leave]
    def index
      servers = current_user.servers
      render json: servers, each_serializer: ServerSerializer, scope: current_user, status: :ok
    end

    def create
      server = Server.new(server_params)
      if server.save
        ServerMember.create(server: server, user: current_user, role: 'owner')
        render json: server, serializer: ServerSerializer, scope: current_user, status: :created
      else
        render json: { errors: server.errors.full_message }, status: :unprocessable_entity
      end
    end

    def join
      if @server.user.include?(current_user)
        render json: { message: '既にサーバーに参加しています。' }, status: :forbidden
      else
        ServerMember.create!(server: @server, user: current_user, role: 'member')
        render json: { message: 'サーバーへ参加しました。' }, status: :created
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { erros: e.record.errors }, status: :unprocessable_entity
    end

    def leave
      member = @server.server_members.find_by(user: current_user)
      if member
        member.destroy
        render json: { message: 'サーバーから脱退しました。' }, status: :ok
      end
    end

    private
    def set_server
      @server = Server.find_by(id: params[:id])
      unless @server
        render json: { error: 'サーバーが見つかりません。' }, status: :not_found
      end
    end

    def server_params
      params.require(:server).permit(:name, :icon_url)
    end
  end
end
