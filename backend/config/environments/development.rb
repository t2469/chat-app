Rails.application.configure do
  # Development-specific settings
  config.enable_reloading = true
  config.eager_load = false
  config.consider_all_requests_local = true
  config.action_cable.url = "ws://localhost:3000/cable"
  config.action_cable.allowed_request_origins = ['http://localhost:8000', 'http://127.0.0.1:8000']
  config.action_controller.raise_on_missing_callback_actions = true
end
