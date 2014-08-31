@AdminCreateItem = ($scope, $location, $upload) ->

  $scope.files = []

  $scope.onfileSelect = ($files) ->
    $scope.files = $files

  $scope.onFormSubmit = (item) ->
    file = $scope.files[0] if !!$scope.files[0]
    $scope.upload = $upload.upload(
      url: '/items'
      method: 'POST'
      data:
        "new_item": item
      file: file
    ).success( (data) ->
      if !!data.errors
        $scope.error_item = data.errors
      else
        $location.url "admin/items"
    ).error( (data) ->
      console.log(data.errors)
    )
    
@AdminCreateItem.$inject = ['$scope', '$location', '$upload']