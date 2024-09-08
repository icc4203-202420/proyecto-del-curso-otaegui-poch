Rails.application.routes.draw do
  # devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get 'current_user', to: 'current_user#index'
  devise_for :users, path: '', path_names: {
    sign_in: 'v1/login',
    sign_out: 'api/v1/logout',
    registration: 'v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
    

  }

 


  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :events, only: [:show, :create, :update, :destroy]
    end
  end
  
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars, only: [:index, :show, :create, :update, :destroy]
      resources :beers, only: [:index]
      resources :users do
        member do
          get 'friendships'
          post 'friendships', to: 'users#create_friendship'
        end
        resources :reviews, only: [:index]
      end
      
      resources :reviews, only: [:index, :show, :create, :update, :destroy]

      resources :events, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
