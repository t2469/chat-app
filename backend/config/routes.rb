Rails.application.routes.draw do
  namespace :api do
    post 'signup', to: 'authentication#signup'
    post 'login', to: 'authentication#login'
    resource :user, only: [:show]
    resources :servers, only: [:index, :create] do
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
