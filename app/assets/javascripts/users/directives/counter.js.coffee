angular.module('Shop').directive('counter', ['itemsFactory', '$rootScope', (itemsFactory, $rootScope) ->

  restrict: 'E'
  templateUrl: "../assets/users/directives/counter.html"
  replace: true
  scope:
    index: "="
    itemRaw: "&"
  link: (scope, element, attrs) ->

    scope.inc = (itemId) ->
      itemsFactory.inc(itemId).then( (count) ->
        scope.index.quantity = count
        $rootScope.$broadcast "updatedCart"
      )

    scope.dec = (itemId) ->
      itemsFactory.dec(itemId).then( (count) ->
        console.log(count)
        if count is "deleted"
          scope.itemRaw({id: itemId})
        else
          scope.index.quantity = count
        $rootScope.$broadcast "updatedCart"
      )

])