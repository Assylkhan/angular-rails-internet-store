@Signup = ($scope, Session) ->

  $scope.signup = (email, password, password_confirmation) ->
    Session.register(email, password, password_confirmation).then( (response) ->
      if !!response.data.errors
        $scope.error_user = response.data.errors
    )

  
@Signup.$inject = ['$scope', 'Session']