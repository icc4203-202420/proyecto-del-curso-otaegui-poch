Rails.application.routes.draw do
  # Rutas personalizadas para Devise (login, logout, signup)
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Ruta raíz y chequeo de estado de la aplicación
  root to: "home#index"
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # Rutas para usuarios y sus relaciones
      resources :friendships, only: [:index]
      resources :users do
        member do
          get 'friendships'
          post 'create_friendship'  # Cambiado para coincidir con el endpoint
          delete 'destroy_friendship'
          get 'feed'
        end
        resources :reviews, only: [:index]
      end

      # El resto de tus rutas...
      resources :bars, only: [:index, :show, :create, :update, :destroy]
      resources :events, only: [:index, :show, :create, :update, :destroy] do
        collection do
          get 'feed'
        end
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
      resources :reviews, only: [:index, :show, :create, :update, :destroy]
      resources :feeds, only: [:index]

    end
  end
end