Rails.application.routes.draw do
  # devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get 'current_user', to: 'current_user#index'
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  root to: "home#index"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post 'login', to: 'sessions#create'
      resources :bars, only: [:index, :show, :create, :update, :destroy] do
        # Uncomment this line if you want events nested under bars
        # resources :events, only: [:index]
      end

      resources :events, only: [:index, :show, :create, :update, :destroy, :upload_picture, :pictures] do
        member do
          post 'check_in'
          post 'upload_picture'
          get 'pictures'
          post 'tag_user'
          
        end
      end

      resources :beers
      resources :brands, only: [:show]  
      resources :breweries, only: [:show]  
      resources :bars_beers, only: [:index, :show, :create, :destroy]

      resources :users, only: [:index,:show, :create, :update] do
        member do
          get 'friendships'
          post 'friendships', to: 'users#create_friendship'
        end
        resources :reviews, only: [:index]
      end

      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
