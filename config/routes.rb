Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  # get "/articles", to: redirect("/index.html")

  namespace :api do
    namespace :v1 do
      resources :articles do
        resources :comments
      end
    end
  end

  get "*other", to: "static#index"

  # Defines the root path route ("/")
  # root "posts#index"
end
