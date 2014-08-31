@ShowCart = ($scope, itemsFactory, $state, $location) ->

  $scope.showCartContent = ->
    itemsFactory.showCartContent().then( (cart) ->
      if cart.length > 0
        $scope.cart = cart
      else
        $scope.message = "Your basket is currently empty. Take advantage of our catalog to fill it."
    )

  $scope.number = 1
  $scope.sent = ""

  $scope.showCartContent()

  $scope.login = ->
    $location.path "/users/login"

  $scope.signup = ->
    $location.path "/users/signup"

  $scope.deleteRaw = (id) ->
    $scope.showCartContent()
    # angular.element('#item_'+id).remove()
    return true
    
  $scope.removeFromCart = (id) ->
    itemsFactory.removeFromCart(id).then( ->
      angular.element("#item_"+id).fadeOut(1000)
    )

  $scope.order = ->
    itemsFactory.order().then( ->
      $scope.$emit "event:sent"
      $location.path "/users/items"
    , ->
      $scope.$emit "event:not sent"
    )

@ShowCart.$inject = ['$scope', 'itemsFactory', '$state', '$location']