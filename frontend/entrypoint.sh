if [ "$APP_ENV" = "production" ]; then
  echo "Running in production mode..."
  npm run build
  npm run start -- -H 0.0.0.0
else
  echo "Running in development mode..."
  npm run dev -- -H 0.0.0.0
fi
