#!/bin/bash
set -e

# RailsサーバーのPIDファイルを削除
rm -f /app/tmp/pids/server.pid

# コンテナのメインプロセスを実行
exec "$@"
