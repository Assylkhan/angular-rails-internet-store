@Items = ($scope, $http, $location, itemsFactory, storage, $window) ->
  $scope.items = [{ name: 'Loading...' }]
  $scope.currentPage = 1
  $scope.range = []
  # $scope.itemsCount = ''
  $scope.$on "/users/items", (event) ->
    angular.element("#items>p:first-child").val('')
    $scope.itemsCount = ''
    $scope.getItems()

  $scope.getItems = (search_phrase) ->
    itemsFactory.getItems(search_phrase).then( (response) ->
      $scope.items = response.data.items
      $scope.currentPage = response.data.currentPage
      $scope.range = response.data.range
      if search_phrase != undefined
        $scope.itemsCount = "found "+response.data.items_count+" items"
      if response.data.items_count == 0
        $scope.itemsCount = "no such item in store"
    , ->
      console.log("error in items")
    )

  $scope.getItems()

  $scope.getPage = (n) ->
    itemsFactory.getPage(n).then( (response) ->
      $scope.items = response.data.items
      $scope.currentPage = response.data.currentPage
      $scope.range = response.data.range
      $location.path "/users/items"
    , ->
      console("error ocurred")
    )

  $scope.addToCart = (item) ->
    quantity = 1
    itemsFactory.addToCart(item, quantity)

  $scope.showItem = (id) ->
    $location.path "/users/items/"+id

  console.log(storage.get('order')) if storage.get('order') isnt undefined

@Items.$inject = ['$scope', '$http', '$location', 'itemsFactory', 'storage', '$window']