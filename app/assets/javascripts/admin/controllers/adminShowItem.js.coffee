@AdminShowItem = ($scope, $location, $stateParams, itemData) ->

  $scope.item = ''  
  $scope.itemId = $stateParams.itemId

  itemData.getItem($scope.itemId).then( (response) ->
    $scope.item = response
  )

  $scope.edit = ->
    $location.path "/admin/items/"+$scope.itemId+"/update"
  
@AdminShowItem.$inject = ['$scope', '$location', '$stateParams', 'itemData']