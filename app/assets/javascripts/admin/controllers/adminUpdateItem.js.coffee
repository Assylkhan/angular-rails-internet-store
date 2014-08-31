@AdminUpdateItem = ($scope, itemData, $stateParams, $upload, $location) ->
  $scope.item = ''  
  $scope.itemId = $stateParams.itemId
  $scope.files = []

  itemData.getItem($scope.itemId).then( (response) ->
    $scope.item = response
  )


  $scope.onfileSelect = ($files) ->
    $scope.files = $files

  $scope.onFormSubmit = (item) ->
    file = $scope.files[0] if !!$scope.files[0]
    $scope.upload = $upload.upload(
      url: '/items/'+$scope.itemId
      method: 'PUT'
      params:
        "edit_item": item
      file: file
    ).success( (data) ->
      if !!data.errors
        $scope.error_item = data.errors
      else
        $location.url "admin/items"
    ).error( (data) ->
      console.log(data.errors)
    )

@AdminUpdateItem.$inject = ['$scope', 'itemData', '$stateParams', '$upload', '$location']