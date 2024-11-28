# DiscordLike-app

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

### 実装
* ユーザー認証（サインアップ、ログイン） 実装中
* ユーザー管理（プロフィール編集）
* サーバー（チーム）作成と管理
* チャンネル作成と管理
* リアルタイムチャットメッセージの送受信
* 通知機能
* 検索機能
* 設定機能
* フロントエンドのUI/UX改善
* テストとデプロイ