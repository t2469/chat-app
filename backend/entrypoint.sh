#!/bin/bash
set -e

# APP_ENV が設定されていない場合は 'development' をデフォルトとする
export APP_ENV=${APP_ENV:-development}

# APP_ENV の値を RAILS_ENV と RACK_ENV にコピー
export RAILS_ENV=${APP_ENV}
export RACK_ENV=${APP_ENV}

# デバッグ用: 環境変数を出力
echo "APP_ENV: $APP_ENV"
echo "RAILS_ENV: $RAILS_ENV"
echo "RACK_ENV: $RACK_ENV"

# RailsサーバーのPIDファイルを削除
rm -f /app/tmp/pids/server.pid

# コンテナのメインプロセスを実行
exec "$@"
