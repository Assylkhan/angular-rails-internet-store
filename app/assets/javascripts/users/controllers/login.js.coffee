@Login = ($scope, Session) ->

  $scope.logIn = (email, password) ->
    Session.login(email, password).then( ->
      console.log("success")
    , ->
      $scope.authError = "credentials are not valid!"
    )
@Login.$inject = ['$scope', 'Session']