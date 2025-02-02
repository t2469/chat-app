module Api
  class Api::ServersController < ApplicationController
    before_action :authenticate_request
    before_action :set_server, only: [:join, :leave, :show]

    # GET /api/servers
    def index
      servers = Server.all
      render json: servers, each_serializer: ServerSerializer, scope: current_user, status: :ok
    end

    # GET /api/servers/my_servers
    def my_servers
      servers = current_user.servers
      render json: servers, each_serializer: ServerSerializer, scope: current_user, status: :ok
    end

    # GET /api/servers/:id
    def show
      if @server.users.include?(current_user)
        render json: @server, serializer: ServerSerializer, scope: current_user, status: :ok
      else
        render json: { error: 'サーバーに参加していません。' }, status: :forbidden
      end
    end

    # POST /api/servers
    def create
      server = Server.new(server_params)
      if server.save
        ServerMember.create(server: server, user: current_user, role: 'owner')
        render json: server, serializer: ServerSerializer, scope: current_user, status: :created
      else
        render json: { errors: server.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # POST /api/servers/:id/join
    def join
      if @server.users.include?(current_user)
        render json: { message: '既にサーバーに参加しています。' }, status: :forbidden
      else
        ServerMember.create!(server: @server, user: current_user, role: 'member')
        render json: { message: 'サーバーへ参加しました。' }, status: :created
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

    # DELETE /api/servers/:id/leave
    def leave
      member = @server.server_members.find_by(user: current_user)
      if member
        member.destroy
        render json: { message: 'サーバーから脱退しました。' }, status: :ok
      else
        render json: { error: 'サーバーに参加していません。' }, status: :unprocessable_entity
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
      params.require(:server).permit(:name)
    end
  end
end