@Admin = ($scope, $http, users, Session) ->

  # $scope.users = ->
  users.getAllUsers()

  $scope.logOut = ->
    Session.logout('/users/items')   

  $scope.users = users
  angular.element(".badge").popover({trigger: 'hover', 'placement': 'right'})
  
@Admin.$inject = ['$scope', '$http', 'users', 'Session']