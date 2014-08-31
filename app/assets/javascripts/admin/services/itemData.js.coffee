angular.module('Shop').factory('itemData', ['$http', '$q', ($http, $q) ->
  
  itemData =
    items: [{name: "..."}]
    item: ''
    range: []
    currentPage: 1
    orders: []
  
  itemData.getItems = (search_phrase) ->
    deferred = $q.defer()
    promises = []
    if search_phrase is undefined
      search_phrase = ''
    $http(
      method: 'GET'
      url: '/items'
      params:
        page: 1
        search: search_phrase
    ).success( (response) ->
      console.log(response)
      deferred.resolve(response)
    ).error(->
      deferred.reject()
      console.log("error ocurred")
    )
    return deferred.promise

  itemData.getPage = (n) ->
    deferred = $q.defer()
    if n is undefined
      n = 1
    $http(
      method: 'GET'
      url: '/items'
      params: 
        page: n
    ).success( (response) ->
      console.log(response)
      deferred.resolve(response)
    ).error(->
      deferred.reject()
      console.log("error ocurred")
    )
    return deferred.promise

  itemData.getItem = (itemId) ->
    deferred = $q.defer()
    $http(
      method: 'GET'
      url: '/items/'+itemId
      # params: itemId
    ).success( (response) ->
      deferred.resolve(response)
    ).error( ->
      console.log("no such item")
      deferred.reject()
    )
    return deferred.promise

  itemData.removeItem = (itemId) ->
    deferred = $q.defer()
    $http(
      method: 'POST'
      url: 'items/remove'
      data: 
        id: itemId
    ).success( ->
      deferred.resolve()
    ).error( ->
      deferred.reject()
    )
    return deferred.promise

  itemData.getPageOrders = (n) ->
    deferred = $q.defer()
    if n is undefined
      n = 1
    $http(
      method: 'GET'
      url: '/orders'
      params: 
        page: n
    ).success( (response) ->
      console.log(response)
      deferred.resolve(response)
    ).error(->
      deferred.reject()
      console.log("error ocurred")
    )
    return deferred.promise

  itemData.getOrders = () ->
    deferred = $q.defer()
    $http(
      method: 'GET'
      url: '/orders'
    ).success( (orders) ->
      deferred.resolve(orders)
    ).error( ->
      deferred.reject()
    )
    return deferred.promise

  itemData.orderContent = (id) ->
    deferred = $q.defer()
    $http(
      method: 'GET'
      url: '/orders/'+id
    ).success( (response) ->
      deferred.resolve(response)
    ).error( ->
      deferred.reject()
    )
    return deferred.promise

  return itemData

])