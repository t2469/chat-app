Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'signup', to: 'authentication#signup'
      post 'login', to: 'authentication#login'
      # match 'signup', to: 'authentication#signup', via: :options
      # match 'login', to: 'authentication#login', via: :options
      resource :user, only: [:show, :update]
    end
  end

  mount ActionCable.server => '/cable'
end
