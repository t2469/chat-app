# DiscordLike-app
URL: http://13.114.232.178:8000/login

### テスト用ユーザー

メールアドレス: test@test

パスワード: test

## ER図
User ──< ServerMember >── Server ──< Channel ──< Message

### User
関連付け
* has_many :server_members
* has_many :servers, through: :server_members
* has_many :messages
* has_many :channels, through: :servers

### Server
関連付け
* belongs_to :owner, class_name: 'User'
* has_many :server_members, dependent: :destroy
* has_many :users, through: :server_members
* has_many :channels, dependent: :destroy

### ServerMember
関連付け
* belongs_to :user
* belongs_to :server

### Channel
関連付け
* belongs_to :server
* has_many :messages, dependent: :destroy
* has_many :users, through: :messages

### Message
関連付け
* belongs_to :user
* belongs_to :channel
