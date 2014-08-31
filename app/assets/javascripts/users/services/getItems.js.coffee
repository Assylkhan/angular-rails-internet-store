angular.module('Shop').factory('itemsFactory', ['$http', '$q', '$rootScope', 'storage', ($http, $q, $rootScope, storage) ->
  data =
    items: [{name: "..."}]
    range: []
    currentPage: 1
    cart: []
  getItems: (search_phrase) ->
    if search_phrase is undefined
      search_phrase = ''
    $http(
      method: 'GET'
      url: '/items'
      params:
        page: 1
        search: search_phrase
    )

  getPage: (n) ->
    if n is undefined
      n = 1
    $http(
      method: 'GET'
      url: '/items'
      params: 
        page: n
    )

  addToCart: (item, quantity) ->
    index = {}
    index['id'] = ""
    index['item'] = ""
    index['quantity'] = 0
    # quantity = 0 if quantity is undefined
    have = false
    if storage.get('cart') is null
      cart = []
      storage.set('cart', cart)
    cart = storage.get('cart') 
    _.each(cart, (key) ->

      if key.id is item.id
        have = true
    )
    if have
      _.map(cart, (key) ->
        if key.id is item.id
          key.quantity += quantity
      )
    else
      index['id'] = item.id
      index['item'] = item
      index['quantity'] = quantity
      cart.push(index)
    storage.set('cart', cart)
    $rootScope.$broadcast "updatedCart"

  removeFromCart: (id) ->
    deferred = $q.defer()
    cart = storage.get('cart')
    arr = _.without(cart, _.findWhere(cart, {id: id}))
    cart = arr
    storage.set('cart', cart)
    deferred.resolve()
    $rootScope.$broadcast "updatedCart"
    deferred.promise

  inc: (itemId) ->
    deferred = $q.defer()
    cart = storage.get('cart')
    _.map(cart, (key) ->
      if key['id'] == itemId
        key['quantity']++
        deferred.resolve(key['quantity'])
    )
    storage.set('cart', cart)
    deferred.promise

  dec: (itemId) ->
    deferred = $q.defer()
    cart = storage.get('cart')
    _.map(cart, (key) ->
      if key['id'] == itemId
        if key['quantity'] is 1
          cart.splice(cart.indexOf(key), 1)
          storage.set('cart', cart)
          deferred.resolve("deleted")
        else if key['quantity'] > 1
          key['quantity']--
          storage.set('cart', cart )
          deferred.resolve(key['quantity'])
    )
    return deferred.promise

  order: () ->
    dispatcher = new WebSocketRails('localhost:3000/websocket')
    cart = storage.get('cart')
    $http(
      method: 'POST'
      url: '/orders'
      data:
        cart: cart
    ).success( (response) ->
      dispatcher.trigger('create', 'new order!')
      console.log(response)
    )

  showCartContent: () ->
    deferred = $q.defer()
    deferred.resolve(storage.get('cart'))
    deferred.promise

  getItem: (itemId) ->
    $http(
      method: 'GET'
      url: '/items/'+itemId
    )

])