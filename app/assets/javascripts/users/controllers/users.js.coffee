@Users = ($scope, Session, $cookies, $location, itemsFactory, storage, $timeout) ->
  $scope.currentUser = null
  $scope.$on "event:authenticated", (event) ->
    $scope.currentUser = Session.currentUser
  $scope.$on "event:unauthorized", (event) ->
    console.log("unauthorized")

  $scope.$on "event:sent", (event) ->
    $scope.sent = "the order has been sent successfully"
    $timeout ( ->
      $scope.sent = ""
    ), 5000
  $scope.$on "event:not sent", (event) ->
    $scope.sent = "the order has not been sent"
    $timeout ( ->
      $scope.sent = ""
    ), 5000

  $scope.Home = ->
    $location.url "/users/items"
    $scope.$broadcast "/users/items"

  $scope.$on "loggedOut", (event) ->
    $scope.currentUser = null

  $scope.$on "currentUser", (event, response) ->
    $scope.currentUser = response

  $scope.$on "signup try", (event) ->
    $scope.signedUp = "You are already signed up, if you want to sign up once more sign out and try again"
    $timeout ( ->
      $scope.signedUp = ""
    ), 4000

  $scope.$on "signin try", (event) ->
    $scope.signedIn = "You are already logged in"
    $timeout ( ->
      $scope.signedIn = ""
    ), 4000

  $scope.$on "profile try", (event) ->
    $scope.signedIn = "You are not logged in yet"
    $timeout ( ->
      $scope.signedIn = ""
    ), 4000

  if !!$cookies.remember_token
    Session.requestCurrentUser()

  $scope.loggedIn = ->
    !!$scope.currentUser

  $scope.logOut = ->
    Session.logout('/users/items')

  $scope.count = 0
  $scope.summ = 0
  if ($scope.count is 0) or ($scope.count > 1)
      $scope.item = "items"
  else
    $scope.item = "item"
  
  $scope.$on "updatedCart", (event) ->
    $scope.cart = storage.get('cart')
    count = 0
    _.each($scope.cart, (key) ->
      count += key['quantity']
    )
    $scope.count = count
    if ($scope.count is 0) or ($scope.count > 1)
      $scope.item = "items"
    else
      $scope.item = "item"
    summ = 0
    _.each($scope.cart, (key) ->
      summ += key['item'].price*key['quantity']
    )
    $scope.summ = summ

  $scope.onLoad = () ->
    $scope.cart = storage.get('cart')
    count = 0
    _.each($scope.cart, (key) ->
      count += key['quantity']
    )
    $scope.count = count
    if ($scope.count is 0) or ($scope.count > 1)
      $scope.item = "items"
    else
      $scope.item = "item"
    summ = 0
    _.each($scope.cart, (key) ->
      summ += key['item'].price*key['quantity']
    )
    $scope.summ = summ

  $scope.onLoad()
  

@Users.$inject = ['$scope', 'Session', '$cookies', '$location', 'itemsFactory', 'storage', '$timeout']