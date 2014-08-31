angular.module("sessionService", ['ngCookies']).factory "Session", ($location, $http, $q, $cookies, $rootScope) ->
  
  # Redirect to the given url (defaults to '/')
  redirect = (url) ->
    url = url or "/"
    $location.path url
  service =
    currentUser: null
    login: (email, password) ->
      $http.post("/sessions/login",
        session:
          email: email
          password: password
      ).success( (response) ->
        if response != "no"
          service.currentUser = response
          $rootScope.$broadcast "event:authenticated"
          if service.currentUser.admin is true
            $location.path "/admin/items"
          else
            $location.path "/users/profile"
      )


    logout: (redirectTo) ->
      $http.post("/sessions/logout").success( () ->
        service.currentUser = null
        $rootScope.$broadcast "loggedOut"
        redirect redirectTo
      )


    register: (email, password, confirm_password) ->
      $http.post("/users",
        user:
          email: email
          password: password
          password_confirmation: confirm_password
      ).success( (response) ->
        unless !!response.errors
          service.currentUser = response
          console.log(service.currentUser)
          $rootScope.$broadcast "event:authenticated"
          if service.currentUser.admin is true
              $location.path "/admin/items"
            else
              $location.path "/users/profile"
      ).error( ->
        console.log("error ocurred")
      )

    requestCurrentUser: ->
      $http.get("/sessions/currentUser").success( (response) ->
        service.currentUser = response
        $rootScope.$broadcast "currentUser", response
      )

    isAuthenticated: ->
      $http.get("/sessions/isAuthenticated")

  service