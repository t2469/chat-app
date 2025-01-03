Rails.application.routes.draw do
  namespace :api do
    post 'signup', to: 'authentication#signup'
    post 'login', to: 'authentication#login'
    resource :user, only: [:show]
    resources :servers, only: [:index, :create] do
      member do
        post :join
        delete :leave
      end
    end
  end
end
