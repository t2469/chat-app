Rails.application.configure do
  # Production-specific settings
  config.eager_load = true
  config.consider_all_requests_local = false
  config.force_ssl = false
  config.action_cable.url = "ws://13.114.232.178:3000/cable"
  config.action_cable.allowed_request_origins = ['http://13.114.232.178:8000', 'https://13.114.232.178:8000']
  config.hosts << "13.114.232.178"
end
