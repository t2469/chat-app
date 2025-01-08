module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      reject_unauthorized_connection unless current_user
    end

    private

    # JWT トークンを受け取り、ユーザーを特定
    def find_verified_user
      token = request.params[:token]
      return nil if token.blank?

      # decode_token はJWTをデコードし、payloadを取り出すメソッド
      payload = decode_token(token)
      return nil unless payload

      user_id = payload['user_id']
      User.find_by(id: user_id)
    rescue JWT::DecodeError
      nil
    end

    def decode_token(token)
      secret_key = Rails.application.credentials.secret_key_base
      decoded_array = JWT.decode(token, secret_key, true, { algorithm: 'HS256' })
      decoded_array.first
    end
  end
end
