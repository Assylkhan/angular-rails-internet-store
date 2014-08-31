@ShowItem = ($scope, itemsFactory, $stateParams) ->
  $scope.item = "loading..."

  itemId = $stateParams.itemId

  itemsFactory.getItem(itemId).then( (response) ->
    $scope.item = response.data
  )
  $scope.addToCart = (item) ->
    quantity = 1
    itemsFactory.addToCart(item, quantity)

@ShowItem.$inject = ['$scope', 'itemsFactory', '$stateParams']