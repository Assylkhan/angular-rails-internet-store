# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

#= require_self
#= require_tree ./admin/controllers
#= require_tree ./admin/services
#= require_tree ./admin/directives
#= require_tree ./users/controllers
#= require_tree ./users/directives
#= require_tree ./users/services

Shop = angular.module('Shop', ['ngAnimate', 'ngRoute', 'sessionService', 'angularFileUpload', 'ui.router', 'angularLocalStorage', 'ui.bootstrap', 'angularModalService'])

Shop.config(['$httpProvider', ($httpProvider) ->
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')

  interceptor = ['$location', '$rootScope', '$q', ($location, $rootScope, $q) ->
    success = (response) ->
      response
    error = (response) ->
      if response.status is 401
        $rootScope.$broadcast "event:unauthorized"
        $location.path "/users/signin"
        return response
      $q.reject response
    return (promise) ->
      promise.then success, error
  ]
  $httpProvider.responseInterceptors.push interceptor
])

# checkRouting = ($q, $rootScope, $location, Session) ->
#   if !!Session.currentUser
#     console.log("Session.currentUser")
#     true
#   else
#     defered = $q.defer()
#     if Session.isAuthenticated()
#       defered.resolve true
#       console.log("Session.isAuthenticated")
#       return
#     else
#       defered.reject()
#       $location.path "/users/signin"
#       return

#     defered.promise
# angular.module('Shop').provider($stateProvider, () ->
#   this.$get = ($http) ->
#     return $stateProvider
# )

Shop.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) ->

  $stateProvider
    .state "admin", 
      resolve: 
        promiseObj: ['$http', '$location', ($http, $location) ->
          return $http(
            method: 'GET'
            url: 'sessions/isAdmin'
          ).then( ->
            console.log("is admin")
          , ->
            $location.path "/users/items"
          )
        ]
      url: "/admin"
      templateUrl: "../assets/admin/admin.html"
      controller: "Admin"
    

    .state "admin.items", 
      url: "/items"
      templateUrl: "../assets/admin/admin.items.html"
      controller: "AdminItems"
    

    .state "admin.createItem", 
      url: "/createItem"
      templateUrl: "../assets/admin/admin.createItem.html"
      controller: "AdminCreateItem"
    

    .state "admin.showItem", 
      url: "/items/:itemId"
      templateUrl: "../assets/admin/admin.showItem.html"
      controller: "AdminShowItem"
    

    .state "admin.updateItem", 
      url: "/items/:itemId/update" 
      templateUrl: "../assets/admin/admin.updateItem.html"
      controller: "AdminUpdateItem"

    .state "admin.orders", 
      url: "/orders" 
      templateUrl: "../assets/admin/admin.orders.html"
      controller: "AdminOrders"

    # .state "admin.orderContent", 
    #   url: "/orders/:id" 
    #   templateUrl: "../assets/admin/admin.orderContent.html"
    #   controller: "AdminOrderContent"
    

    .state "users", 
      url: "/users"
      templateUrl: "../assets/users/users.html"
      controller: "Users"
    

    .state "users.signup", 
      resolve:
        promiseObj: ['$rootScope', 'Session', '$location', '$q', ($rootScope, Session, $location, $q) ->
          deferred = $q.defer()
          Session.isAuthenticated().then( ->
            $location.path "/users/items"
            $rootScope.$broadcast "signup try"
            deferred.reject()
          , ->
            deferred.resolve()
          )
          deferred.promise
        ]
      url: "/signup" 
      templateUrl: "../assets/users/users.signup.html"
      controller: "Signup"
    
    
    .state "users.login", 
      resolve:
        promiseObj: ['$rootScope', 'Session', '$location', '$q', ($rootScope, Session, $location, $q) ->
          deferred = $q.defer()
          Session.isAuthenticated().then( ->
            $location.path "/users/items"
            $rootScope.$broadcast "signin try"
            deferred.reject()
          , ->
            deferred.resolve()
          )
          deferred.promise
        ]
      url: "/login" 
      templateUrl: "../assets/users/users.login.html"
      controller: "Login"
    

    .state "users.profile",
      resolve:
        promiseObj: ['$rootScope', 'Session', '$location', '$q', ($rootScope, Session, $location, $q) ->
          deferred = $q.defer()
          Session.isAuthenticated().then( ->
            deferred.resolve()
          , ->
            $location.path "/users/items"
            $rootScope.$broadcast "profile try"
            deferred.reject()
          )
          deferred.promise
        ]
      url: "/profile"
      templateUrl: "../assets/users/users.profile.html"
      controller: "Profile"
    

    .state "users.items", 
      url: "/items" 
      templateUrl: "../assets/users/users.items.html"
      controller: 'Items'


    .state "users.showCart",
      url: "/showCart"
      templateUrl: "../assets/users/users.showCart.html"
      controller: 'ShowCart'
    
    
    .state "users.showItem",
      url: "/items/:itemId"
      templateUrl: "../assets/users/users.showItem.html"
      controller: 'ShowItem'
])