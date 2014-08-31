@AdminOrders = ($scope, $http, users, itemData, storage, $location, ModalService) ->

  # $scope.users = ->
  # users.getAllUsers()    

  # $scope.users = users
  $scope.orderContent = (id) ->
    console.log("worked")

  $scope.popupWindow = null
  $scope.orders = []
  $scope.items = []
  $scope.currentPage = 1
  $scope.range = []

  $scope.getOrders = () ->
    itemData.getOrders().then( (data) ->
      
      $scope.orders = data.orders
      $scope.currentPage = data.currentPage
      $scope.range = data.range
    , ->
      console.log("error in orders")
    )

  $scope.getOrders()

  $scope.getPage = (n) ->
    itemData.getPageOrders(n).then( (data) ->
      $scope.orders = data.orders
      $scope.currentPage = data.currentPage
      $scope.range = data.range
      $location.path "/admin/orders"
    , ->
      console("error ocurred")
    )


  $scope.orderContent = (id) ->
    itemData.orderContent(id).then( (response) ->
      ModalService.showModal(
        templateUrl: '../assets/admin/admin.orderContent.html'
        controller: "AdminOrderContent"
      ).then( (modal) ->
        modal.element.modal()
        modal.scope.orderItems = response
      )
    )


  dispatcher = new WebSocketRails('localhost:3000/websocket')

  dispatcher.bind 'new_order', (new_order) ->
    console.log(new_order)
    storage.set('order', new_order)

  
@AdminOrders.$inject = ['$scope', '$http', 'users', 'itemData', 'storage', '$location', 'ModalService']