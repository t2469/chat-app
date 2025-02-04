Rails.application.routes.draw do
  namespace :api do
    post 'signup', to: 'authentication#signup'
    post 'login', to: 'authentication#login'
    resource :user, only: [:show,:destroy]
    resources :servers do
      resources :channels do
        resources :messages, only: [:index, :create]
      end
      collection do
        get :my_servers
      end
      member do
        post :join
        delete :leave
      end
    end
  end
  mount ActionCable.server => '/cable'
end
