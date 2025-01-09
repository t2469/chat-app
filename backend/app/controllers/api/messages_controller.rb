module Api
  class MessagesController < ApplicationController
    before_action :authenticate_request
    before_action :set_server
    before_action :set_channel

    # GET /api/servers/:server_id/channels/:channel_id/messages
    def index
      messages = @channel.messages.includes(:user).order(created_at: :asc).map do |msg|
        {
          id: msg.id,
          content: msg.content,
          user_id: msg.user_id,
          username: msg.user.username,
          created_at: msg.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
      end
      render json: messages, status: :ok
    end

    # POST /api/servers/:server_id/channels/:channel_id/messages
    def create
      @message = @channel.messages.new(message_params)
      @message.user = current_user
      if @message.save
        # Action Cableでブロードキャスト
        ChannelMessagesChannel.broadcast_to(@channel, {
          id: @message.id,
          content: @message.content,
          user_id: @message.user_id,
          username: @message.user.username,
          created_at: @message.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
        render json: @message, status: :created
      else
        render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_server
      @server = Server.find(params[:server_id])
    end

    def set_channel
      @channel = @server.channels.find(params[:channel_id])
    end

    def message_params
      params.require(:message).permit(:content)
    end
  end
end
