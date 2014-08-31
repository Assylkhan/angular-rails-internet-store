@AdminItems = ($scope, $http, $location, itemData) ->
  $scope.items = [{ name: 'Loading...' }]
  $scope.currentPage = 1
  $scope.range = []
  $scope.itemError = ""

  $scope.getItems = (search_phrase) ->
    itemData.getItems(search_phrase).then( (data) ->
      
      $scope.items = data.items
      $scope.currentPage = data.currentPage
      $scope.range = data.range
    , ->
      console.log("error in items")
    )

  $scope.getItems()

  $scope.getPage = (n) ->
    itemData.getPage(n).then( (data) ->
      $scope.items = data.items
      $scope.currentPage = data.currentPage
      $scope.range = data.range
      $location.path "/admin/items"
    , ->
      console("error ocurred")
    )

  $scope.reviewItem = (id) ->
    $location.path '/admin/items/'+id

  $scope.edit = (id) ->
    $location.path "/admin/items/"+id+"/update"

  $scope.remove = (id) ->
    itemData.removeItem(id).then( ->
      $location.path "/admin/items"
    , ->
      $scope.itemError = "cannot remove"
    )

@AdminItems.$inject = ['$scope', '$http', '$location', 'itemData']