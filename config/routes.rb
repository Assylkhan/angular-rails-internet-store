Rails.application.routes.draw do
  root to: 'items#index'

  resources :items, defaults: {format: :json}
  post 'items/remove' => 'items#remove', defaults: {format: :json}

  resources :users, defaults: {format: :json}
  resources :orders, defaults: {format: :json}

  get 'sessions/isAuthenticated' => 'sessions#isAuthenticated', defaults: {format: :json}
  get 'sessions/currentUser' => 'sessions#current_user_to_browser', defaults: {format: :json}
  post 'sessions/login' => 'sessions#create', defaults: {format: :json}
  post 'sessions/logout' => 'sessions#destroy', defaults: {format: :json}
  get 'sessions/redirect_back' => 'sessions#redirect_back', defaults: {format: :json}
  get 'sessions/isAdmin' => 'sessions#isAdmin', defaults: {format: :json}

  # post 'web_socket/create' => 'web_socket#create', defaults: {format: :json}

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
