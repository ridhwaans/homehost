Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  root "dashboard#show"
  get "/login", to: "sessions#new", as: :new_login
  post "/login", to: "sessions#create", as: :login
  delete "/logout", to: "sessions#destroy", as: :logout

  resource :dashboard, only: :show, controller: "dashboard"
  resources :media_assets, path: "media", only: %i[index show]
  resources :processing_jobs, path: "jobs", only: %i[index show create]
  resources :users, only: %i[index create destroy]
  resources :profiles, only: %i[index create update destroy]
  resources :collections, only: %i[index show create destroy] do
    resources :items, controller: "collection_items", only: %i[create destroy]
  end
  resources :audit_events, path: "audit", only: :index

  namespace :api do
    namespace :v1 do
      resources :users, only: %i[index create update destroy]
      resources :profiles, only: %i[index create update destroy]
      resources :media_assets, only: %i[index show]
      resources :playback_positions, only: %i[index] do
        collection do
          put :upsert
        end
      end
      resources :collections, only: %i[index show create update destroy] do
        resources :items, controller: "collection_items", only: %i[create destroy]
      end
      resources :processing_jobs, only: %i[index show create]

      namespace :media_engine do
        resources :events, only: :create
      end
    end
  end

  get "/health/live", to: "health#live"
  get "/health/ready", to: "health#ready"
end
