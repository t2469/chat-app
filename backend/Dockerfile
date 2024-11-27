FROM ruby:3.2.2

# 必要なパッケージをインストール
RUN apt-get update -qq \
    && apt-get install -y nodejs default-mysql-client vim less \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# GemfileとGemfile.lockをコピーしてbundle installを実行
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN gem install bundler
RUN bundle install

# entrypoint.shをコピーして実行権限を付与
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# コンテナ起動時に実行させるスクリプト
ENTRYPOINT [ "entrypoint.sh" ]

# Railsサーバーを起動
CMD ["rails", "server", "-b", "0.0.0.0"]
