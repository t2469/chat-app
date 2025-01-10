#!/bin/sh

if [ "$APP_ENV" = "production" ]; then
  echo "Running in production mode..."
  npm run dev
#  npm run build
#  npm run start
else
  echo "Running in development mode..."
  npm run dev
fi

