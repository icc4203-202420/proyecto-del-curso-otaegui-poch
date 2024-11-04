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
      # Rutas de bares y sus eventos relacionados
      resources :bars, only: [:index, :show, :create, :update, :destroy]

      # Rutas para eventos con acciones personalizadas
      resources :events, only: [:index, :show, :create, :update, :destroy] do
        member do
          post 'check_in'
          post 'upload_picture'
          get 'pictures'
          post 'tag_user'
        end
      end

      # Rutas para cervezas, marcas y cervecerías
      resources :beers
      resources :brands, only: [:show]
      resources :breweries, only: [:show]
      resources :bars_beers, only: [:index, :show, :create, :destroy]

      # Rutas para usuarios y sus relaciones de amistad (friendships)
      resources :users, only: [:index, :show, :create, :update] do
        # Endpoint para obtener amistades de un usuario específico
        member do
          get 'friendships', to: 'users#friendships'
          post 'friendships', to: 'users#create_friendship'
        end

        # Endpoint para obtener todas las reseñas de un usuario
        resources :reviews, only: [:index]
      end

      # Rutas para reseñas generales
      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
