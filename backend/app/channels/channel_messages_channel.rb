class ChannelMessagesChannel < ApplicationCable::Channel
  def subscribed
    @channel = Channel.find(params[:channel_id])
    stream_for @channel
  end

  def unsubscribed
  end

  def speak(data)
    return unless current_user

    message = @channel.messages.create!(
      content: data["content"],
      user_id: current_user.id
    )

    # メッセージをブロードキャスト
    ChannelMessagesChannel.broadcast_to(@channel, {
      id: message.id,
      content: message.content,
      user_id: message.user_id,
      username: message.user.username,
      created_at: message.created_at.strftime("%Y-%m-%d %H:%M:%S")
    })
  end
end
