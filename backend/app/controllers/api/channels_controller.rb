class Api::ChannelsController < ApplicationController
  before_action :authenticate_request
  before_action :set_server
  before_action :set_channel, only: [:show, :update, :destroy]

  # GET /api/servers/:server_id/channels
  def index
    @channels = @server.channels
    render json: @channels
  end

  # POST /api/servers/:server_id/channels
  def create
    @channel = @server.channels.build(channel_params)
    if @channel.save
      render json: @channel, status: :created
    else
      render json: { errors: @channel.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /api/servers/:server_id/channels/:id
  def show
    render json: @channel
  end

  # PATCH/PUT /api/servers/:server_id/channels/:id
  def update
    if @channel.update(channel_params)
      render json: @channel
    else
      render json: { errors: @channel.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/servers/:server_id/channels/:id
  def destroy
    @channel.destroy
    head :no_content
  end

  private

  def set_server
    @server = Server.find(params[:server_id])
  end

  def set_channel
    @channel = @server.channels.find(params[:id])
  end

  def channel_params
    params.require(:channel).permit(:name)
  end
end
