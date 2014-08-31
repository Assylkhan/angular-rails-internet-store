angular.module('Shop').factory('users', ['$http', '$q', ($http, $q) ->
  
  users = 
    allUsers: [{email: 'loading'}]
    count: 0
    
  users.getAllUsers = ->
    $http(
      method: 'GET'
      url: '/users'
    ).success( (response) ->
      users.allUsers = response.data
      users.count = response.count
      console.log(users)
    ).error( ->
      console.log("server is not available")
    )
    
  return users
])