FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# Next.js のテレメトリ機能を無効化
ENV NEXT_TELEMETRY_DISABLED 1

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# エントリポイントスクリプトをコピー
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# 環境変数の設定（デフォルトはdevelopment）
ARG APP_ENV=development
ENV APP_ENV=${APP_ENV}

# エントリポイントスクリプトを実行
CMD ["entrypoint.sh"]
