@Profile = ($scope, Session) ->
  
  $scope.currentUser = Session.currentUser
  $scope.$on "currentUser", (event, response) ->
    $scope.currentUser = response

@Profile.$inject = ['$scope', 'Session']