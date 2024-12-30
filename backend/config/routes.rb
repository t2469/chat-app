Rails.application.routes.draw do
  namespace :api do
    post 'signup', to: 'authentication#signup'
    post 'login', to: 'authentication#login'
    resource :user, only: [:show]
  end
end
