@AdminOrderContent = ($scope, itemData, close) ->

  # $scope.orderContent = (itemId) ->
  #   itemData.orderContent(id).then( (response) ->
  #     $scope.items = response
  #   )
  $scope.close = ->
    close('Yes', 500)

@AdminOrderContent.$inject = ['$scope', 'itemData', 'close']