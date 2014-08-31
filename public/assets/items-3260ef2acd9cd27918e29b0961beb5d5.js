(function() {
  var Shop;

  Shop = angular.module('Shop', ['ngAnimate', 'ngRoute', 'sessionService', 'angularFileUpload', 'ui.router', 'angularLocalStorage', 'ui.bootstrap', 'angularModalService']);

  Shop.config([
    '$httpProvider', function($httpProvider) {
      var interceptor;
      $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
      interceptor = [
        '$location', '$rootScope', '$q', function($location, $rootScope, $q) {
          var error, success;
          success = function(response) {
            return response;
          };
          error = function(response) {
            if (response.status === 401) {
              $rootScope.$broadcast("event:unauthorized");
              $location.path("/users/signin");
              return response;
            }
            return $q.reject(response);
          };
          return function(promise) {
            return promise.then(success, error);
          };
        }
      ];
      return $httpProvider.responseInterceptors.push(interceptor);
    }
  ]);

  Shop.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider.state("admin", {
        resolve: {
          promiseObj: [
            '$http', '$location', function($http, $location) {
              return $http({
                method: 'GET',
                url: 'sessions/isAdmin'
              }).then(function() {
                return console.log("is admin");
              }, function() {
                return $location.path("/users/items");
              });
            }
          ]
        },
        url: "/admin",
        templateUrl: "../assets/admin/admin.html",
        controller: "Admin"
      }).state("admin.items", {
        url: "/items",
        templateUrl: "../assets/admin/admin.items.html",
        controller: "AdminItems"
      }).state("admin.createItem", {
        url: "/createItem",
        templateUrl: "../assets/admin/admin.createItem.html",
        controller: "AdminCreateItem"
      }).state("admin.showItem", {
        url: "/items/:itemId",
        templateUrl: "../assets/admin/admin.showItem.html",
        controller: "AdminShowItem"
      }).state("admin.updateItem", {
        url: "/items/:itemId/update",
        templateUrl: "../assets/admin/admin.updateItem.html",
        controller: "AdminUpdateItem"
      }).state("admin.orders", {
        url: "/orders",
        templateUrl: "../assets/admin/admin.orders.html",
        controller: "AdminOrders"
      }).state("users", {
        url: "/users",
        templateUrl: "../assets/users/users.html",
        controller: "Users"
      }).state("users.signup", {
        resolve: {
          promiseObj: [
            '$rootScope', 'Session', '$location', '$q', function($rootScope, Session, $location, $q) {
              var deferred;
              deferred = $q.defer();
              Session.isAuthenticated().then(function() {
                $location.path("/users/items");
                $rootScope.$broadcast("signup try");
                return deferred.reject();
              }, function() {
                return deferred.resolve();
              });
              return deferred.promise;
            }
          ]
        },
        url: "/signup",
        templateUrl: "../assets/users/users.signup.html",
        controller: "Signup"
      }).state("users.login", {
        resolve: {
          promiseObj: [
            '$rootScope', 'Session', '$location', '$q', function($rootScope, Session, $location, $q) {
              var deferred;
              deferred = $q.defer();
              Session.isAuthenticated().then(function() {
                $location.path("/users/items");
                $rootScope.$broadcast("signin try");
                return deferred.reject();
              }, function() {
                return deferred.resolve();
              });
              return deferred.promise;
            }
          ]
        },
        url: "/login",
        templateUrl: "../assets/users/users.login.html",
        controller: "Login"
      }).state("users.profile", {
        resolve: {
          promiseObj: [
            '$rootScope', 'Session', '$location', '$q', function($rootScope, Session, $location, $q) {
              var deferred;
              deferred = $q.defer();
              Session.isAuthenticated().then(function() {
                return deferred.resolve();
              }, function() {
                $location.path("/users/items");
                $rootScope.$broadcast("profile try");
                return deferred.reject();
              });
              return deferred.promise;
            }
          ]
        },
        url: "/profile",
        templateUrl: "../assets/users/users.profile.html",
        controller: "Profile"
      }).state("users.items", {
        url: "/items",
        templateUrl: "../assets/users/users.items.html",
        controller: 'Items'
      }).state("users.showCart", {
        url: "/showCart",
        templateUrl: "../assets/users/users.showCart.html",
        controller: 'ShowCart'
      }).state("users.showItem", {
        url: "/items/:itemId",
        templateUrl: "../assets/users/users.showItem.html",
        controller: 'ShowItem'
      });
      return $urlRouterProvider.when('', "/users/items");
    }
  ]);

}).call(this);
(function() {
  this.Admin = function($scope, $http, users, Session) {
    users.getAllUsers();
    $scope.logOut = function() {
      return Session.logout('/users/items');
    };
    $scope.users = users;
    return angular.element(".badge").popover({
      trigger: 'hover',
      'placement': 'right'
    });
  };

  this.Admin.$inject = ['$scope', '$http', 'users', 'Session'];

}).call(this);
(function() {
  this.AdminCreateItem = function($scope, $location, $upload) {
    $scope.files = [];
    $scope.onfileSelect = function($files) {
      return $scope.files = $files;
    };
    return $scope.onFormSubmit = function(item) {
      var file;
      if (!!$scope.files[0]) {
        file = $scope.files[0];
      }
      return $scope.upload = $upload.upload({
        url: '/items',
        method: 'POST',
        data: {
          "new_item": item
        },
        file: file
      }).success(function(data) {
        if (!!data.errors) {
          return $scope.error_item = data.errors;
        } else {
          return $location.url("admin/items");
        }
      }).error(function(data) {
        return console.log(data.errors);
      });
    };
  };

  this.AdminCreateItem.$inject = ['$scope', '$location', '$upload'];

}).call(this);
(function() {
  this.AdminItems = function($scope, $http, $location, itemData) {
    $scope.items = [
      {
        name: 'Loading...'
      }
    ];
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.itemError = "";
    $scope.getItems = function(search_phrase) {
      return itemData.getItems(search_phrase).then(function(data) {
        $scope.items = data.items;
        $scope.currentPage = data.currentPage;
        return $scope.range = data.range;
      }, function() {
        return console.log("error in items");
      });
    };
    $scope.getItems();
    $scope.getPage = function(n) {
      return itemData.getPage(n).then(function(data) {
        $scope.items = data.items;
        $scope.currentPage = data.currentPage;
        $scope.range = data.range;
        return $location.path("/admin/items");
      }, function() {
        return console("error ocurred");
      });
    };
    $scope.reviewItem = function(id) {
      return $location.path('/admin/items/' + id);
    };
    $scope.edit = function(id) {
      return $location.path("/admin/items/" + id + "/update");
    };
    return $scope.remove = function(id) {
      return itemData.removeItem(id).then(function() {
        return $location.path("/admin/items");
      }, function() {
        return $scope.itemError = "cannot remove";
      });
    };
  };

  this.AdminItems.$inject = ['$scope', '$http', '$location', 'itemData'];

}).call(this);
(function() {
  this.AdminOrderContent = function($scope, itemData, close) {
    return $scope.close = function() {
      return close('Yes', 500);
    };
  };

  this.AdminOrderContent.$inject = ['$scope', 'itemData', 'close'];

}).call(this);
(function() {
  this.AdminOrders = function($scope, $http, users, itemData, storage, $location, ModalService) {
    var dispatcher;
    $scope.orderContent = function(id) {
      return console.log("worked");
    };
    $scope.popupWindow = null;
    $scope.orders = [];
    $scope.items = [];
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.getOrders = function() {
      return itemData.getOrders().then(function(data) {
        $scope.orders = data.orders;
        $scope.currentPage = data.currentPage;
        return $scope.range = data.range;
      }, function() {
        return console.log("error in orders");
      });
    };
    $scope.getOrders();
    $scope.getPage = function(n) {
      return itemData.getPageOrders(n).then(function(data) {
        $scope.orders = data.orders;
        $scope.currentPage = data.currentPage;
        $scope.range = data.range;
        return $location.path("/admin/orders");
      }, function() {
        return console("error ocurred");
      });
    };
    $scope.orderContent = function(id) {
      return itemData.orderContent(id).then(function(response) {
        return ModalService.showModal({
          templateUrl: '../assets/admin/admin.orderContent.html',
          controller: "AdminOrderContent"
        }).then(function(modal) {
          modal.element.modal();
          return modal.scope.orderItems = response;
        });
      });
    };
    dispatcher = new WebSocketRails('localhost:3000/websocket');
    return dispatcher.bind('new_order', function(new_order) {
      console.log(new_order);
      return storage.set('order', new_order);
    });
  };

  this.AdminOrders.$inject = ['$scope', '$http', 'users', 'itemData', 'storage', '$location', 'ModalService'];

}).call(this);
(function() {
  this.AdminShowItem = function($scope, $location, $stateParams, itemData) {
    $scope.item = '';
    $scope.itemId = $stateParams.itemId;
    itemData.getItem($scope.itemId).then(function(response) {
      return $scope.item = response;
    });
    return $scope.edit = function() {
      return $location.path("/admin/items/" + $scope.itemId + "/update");
    };
  };

  this.AdminShowItem.$inject = ['$scope', '$location', '$stateParams', 'itemData'];

}).call(this);
(function() {
  this.AdminUpdateItem = function($scope, itemData, $stateParams, $upload, $location) {
    $scope.item = '';
    $scope.itemId = $stateParams.itemId;
    $scope.files = [];
    itemData.getItem($scope.itemId).then(function(response) {
      return $scope.item = response;
    });
    $scope.onfileSelect = function($files) {
      return $scope.files = $files;
    };
    return $scope.onFormSubmit = function(item) {
      var file;
      if (!!$scope.files[0]) {
        file = $scope.files[0];
      }
      return $scope.upload = $upload.upload({
        url: '/items/' + $scope.itemId,
        method: 'PUT',
        params: {
          "edit_item": item
        },
        file: file
      }).success(function(data) {
        if (!!data.errors) {
          return $scope.error_item = data.errors;
        } else {
          return $location.url("admin/items");
        }
      }).error(function(data) {
        return console.log(data.errors);
      });
    };
  };

  this.AdminUpdateItem.$inject = ['$scope', 'itemData', '$stateParams', '$upload', '$location'];

}).call(this);
(function() {
  this.OrderContent = function($scope) {};

  this.OrderContent.$inject = ['$scope'];

}).call(this);
(function() {
  angular.module('Shop').factory('itemData', [
    '$http', '$q', function($http, $q) {
      var itemData;
      itemData = {
        items: [
          {
            name: "..."
          }
        ],
        item: '',
        range: [],
        currentPage: 1,
        orders: []
      };
      itemData.getItems = function(search_phrase) {
        var deferred, promises;
        deferred = $q.defer();
        promises = [];
        if (search_phrase === void 0) {
          search_phrase = '';
        }
        $http({
          method: 'GET',
          url: '/items',
          params: {
            page: 1,
            search: search_phrase
          }
        }).success(function(response) {
          console.log(response);
          return deferred.resolve(response);
        }).error(function() {
          deferred.reject();
          return console.log("error ocurred");
        });
        return deferred.promise;
      };
      itemData.getPage = function(n) {
        var deferred;
        deferred = $q.defer();
        if (n === void 0) {
          n = 1;
        }
        $http({
          method: 'GET',
          url: '/items',
          params: {
            page: n
          }
        }).success(function(response) {
          console.log(response);
          return deferred.resolve(response);
        }).error(function() {
          deferred.reject();
          return console.log("error ocurred");
        });
        return deferred.promise;
      };
      itemData.getItem = function(itemId) {
        var deferred;
        deferred = $q.defer();
        $http({
          method: 'GET',
          url: '/items/' + itemId
        }).success(function(response) {
          return deferred.resolve(response);
        }).error(function() {
          console.log("no such item");
          return deferred.reject();
        });
        return deferred.promise;
      };
      itemData.removeItem = function(itemId) {
        var deferred;
        deferred = $q.defer();
        $http({
          method: 'POST',
          url: 'items/remove',
          data: {
            id: itemId
          }
        }).success(function() {
          return deferred.resolve();
        }).error(function() {
          return deferred.reject();
        });
        return deferred.promise;
      };
      itemData.getPageOrders = function(n) {
        var deferred;
        deferred = $q.defer();
        if (n === void 0) {
          n = 1;
        }
        $http({
          method: 'GET',
          url: '/orders',
          params: {
            page: n
          }
        }).success(function(response) {
          console.log(response);
          return deferred.resolve(response);
        }).error(function() {
          deferred.reject();
          return console.log("error ocurred");
        });
        return deferred.promise;
      };
      itemData.getOrders = function() {
        var deferred;
        deferred = $q.defer();
        $http({
          method: 'GET',
          url: '/orders'
        }).success(function(orders) {
          return deferred.resolve(orders);
        }).error(function() {
          return deferred.reject();
        });
        return deferred.promise;
      };
      itemData.orderContent = function(id) {
        var deferred;
        deferred = $q.defer();
        $http({
          method: 'GET',
          url: '/orders/' + id
        }).success(function(response) {
          return deferred.resolve(response);
        }).error(function() {
          return deferred.reject();
        });
        return deferred.promise;
      };
      return itemData;
    }
  ]);

}).call(this);
(function() {
  angular.module('Shop').factory('users', [
    '$http', '$q', function($http, $q) {
      var users;
      users = {
        allUsers: [
          {
            email: 'loading'
          }
        ],
        count: 0
      };
      users.getAllUsers = function() {
        return $http({
          method: 'GET',
          url: '/users'
        }).success(function(response) {
          users.allUsers = response.data;
          users.count = response.count;
          return console.log(users);
        }).error(function() {
          return console.log("server is not available");
        });
      };
      return users;
    }
  ]);

}).call(this);
(function() {
  this.Items = function($scope, $http, $location, itemsFactory, storage, $window) {
    $scope.items = [
      {
        name: 'Loading...'
      }
    ];
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.$on("/users/items", function(event) {
      angular.element("#items>p:first-child").val('');
      $scope.itemsCount = '';
      return $scope.getItems();
    });
    $scope.getItems = function(search_phrase) {
      return itemsFactory.getItems(search_phrase).then(function(response) {
        $scope.items = response.data.items;
        $scope.currentPage = response.data.currentPage;
        $scope.range = response.data.range;
        if (search_phrase !== void 0) {
          $scope.itemsCount = "found " + response.data.items_count + " items";
        }
        if (response.data.items_count === 0) {
          return $scope.itemsCount = "no items in store";
        }
      }, function() {
        return console.log("error in items");
      });
    };
    $scope.getItems();
    $scope.getPage = function(n) {
      return itemsFactory.getPage(n).then(function(response) {
        $scope.items = response.data.items;
        $scope.currentPage = response.data.currentPage;
        $scope.range = response.data.range;
        return $location.path("/users/items");
      }, function() {
        return console("error ocurred");
      });
    };
    $scope.addToCart = function(item) {
      var quantity;
      quantity = 1;
      return itemsFactory.addToCart(item, quantity);
    };
    $scope.showItem = function(id) {
      return $location.path("/users/items/" + id);
    };
    if (storage.get('order') !== void 0) {
      return console.log(storage.get('order'));
    }
  };

  this.Items.$inject = ['$scope', '$http', '$location', 'itemsFactory', 'storage', '$window'];

}).call(this);
(function() {
  this.Login = function($scope, Session) {
    return $scope.logIn = function(email, password) {
      return Session.login(email, password).then(function() {
        return console.log("success");
      }, function() {
        return $scope.authError = "credentials are not valid!";
      });
    };
  };

  this.Login.$inject = ['$scope', 'Session'];

}).call(this);
(function() {
  this.Profile = function($scope, Session) {
    $scope.currentUser = Session.currentUser;
    return $scope.$on("currentUser", function(event, response) {
      return $scope.currentUser = response;
    });
  };

  this.Profile.$inject = ['$scope', 'Session'];

}).call(this);
(function() {
  this.ShowCart = function($scope, itemsFactory, $state, $location) {
    $scope.showCartContent = function() {
      return itemsFactory.showCartContent().then(function(cart) {
        if (cart.length > 0) {
          return $scope.cart = cart;
        } else {
          return $scope.message = "Your basket is currently empty. Take advantage of our catalog to fill it.";
        }
      });
    };
    $scope.number = 1;
    $scope.sent = "";
    $scope.showCartContent();
    $scope.login = function() {
      return $location.path("/users/login");
    };
    $scope.signup = function() {
      return $location.path("/users/signup");
    };
    $scope.deleteRaw = function(id) {
      $scope.showCartContent();
      return true;
    };
    $scope.removeFromCart = function(id) {
      return itemsFactory.removeFromCart(id).then(function() {
        return angular.element("#item_" + id).fadeOut(1000);
      });
    };
    return $scope.order = function() {
      return itemsFactory.order().then(function() {
        $scope.$emit("event:sent");
        return $location.path("/users/items");
      }, function() {
        return $scope.$emit("event:not sent");
      });
    };
  };

  this.ShowCart.$inject = ['$scope', 'itemsFactory', '$state', '$location'];

}).call(this);
(function() {
  this.ShowItem = function($scope, itemsFactory, $stateParams) {
    var itemId;
    $scope.item = "loading...";
    itemId = $stateParams.itemId;
    itemsFactory.getItem(itemId).then(function(response) {
      return $scope.item = response.data;
    });
    return $scope.addToCart = function(item) {
      var quantity;
      quantity = 1;
      return itemsFactory.addToCart(item, quantity);
    };
  };

  this.ShowItem.$inject = ['$scope', 'itemsFactory', '$stateParams'];

}).call(this);
(function() {
  this.Signup = function($scope, Session) {
    return $scope.signup = function(email, password, password_confirmation) {
      return Session.register(email, password, password_confirmation).then(function(response) {
        if (!!response.data.errors) {
          return $scope.error_user = response.data.errors;
        }
      });
    };
  };

  this.Signup.$inject = ['$scope', 'Session'];

}).call(this);
(function() {
  this.Users = function($scope, Session, $cookies, $location, itemsFactory, storage, $timeout) {
    $scope.currentUser = null;
    $scope.$on("event:authenticated", function(event) {
      return $scope.currentUser = Session.currentUser;
    });
    $scope.$on("event:unauthorized", function(event) {
      return console.log("unauthorized");
    });
    $scope.$on("event:sent", function(event) {
      $scope.sent = "the order has been sent successfully";
      return $timeout((function() {
        return $scope.sent = "";
      }), 5000);
    });
    $scope.$on("event:not sent", function(event) {
      $scope.sent = "the order has not been sent";
      return $timeout((function() {
        return $scope.sent = "";
      }), 5000);
    });
    $scope.Home = function() {
      $location.url("/users/items");
      return $scope.$broadcast("/users/items");
    };
    $scope.$on("loggedOut", function(event) {
      return $scope.currentUser = null;
    });
    $scope.$on("currentUser", function(event, response) {
      return $scope.currentUser = response;
    });
    $scope.$on("signup try", function(event) {
      $scope.signedUp = "You are already signed up, if you want to sign up once more sign out and try again";
      return $timeout((function() {
        return $scope.signedUp = "";
      }), 4000);
    });
    $scope.$on("signin try", function(event) {
      $scope.signedIn = "You are already logged in";
      return $timeout((function() {
        return $scope.signedIn = "";
      }), 4000);
    });
    $scope.$on("profile try", function(event) {
      $scope.signedIn = "You are not logged in yet";
      return $timeout((function() {
        return $scope.signedIn = "";
      }), 4000);
    });
    if (!!$cookies.remember_token) {
      Session.requestCurrentUser();
    }
    $scope.loggedIn = function() {
      return !!$scope.currentUser;
    };
    $scope.logOut = function() {
      return Session.logout('/users/items');
    };
    $scope.count = 0;
    $scope.summ = 0;
    if (($scope.count === 0) || ($scope.count > 1)) {
      $scope.item = "items";
    } else {
      $scope.item = "item";
    }
    $scope.$on("updatedCart", function(event) {
      var count, summ;
      $scope.cart = storage.get('cart');
      count = 0;
      _.each($scope.cart, function(key) {
        return count += key['quantity'];
      });
      $scope.count = count;
      if (($scope.count === 0) || ($scope.count > 1)) {
        $scope.item = "items";
      } else {
        $scope.item = "item";
      }
      summ = 0;
      _.each($scope.cart, function(key) {
        return summ += key['item'].price * key['quantity'];
      });
      return $scope.summ = summ;
    });
    $scope.onLoad = function() {
      var count, summ;
      $scope.cart = storage.get('cart');
      count = 0;
      _.each($scope.cart, function(key) {
        return count += key['quantity'];
      });
      $scope.count = count;
      if (($scope.count === 0) || ($scope.count > 1)) {
        $scope.item = "items";
      } else {
        $scope.item = "item";
      }
      summ = 0;
      _.each($scope.cart, function(key) {
        return summ += key['item'].price * key['quantity'];
      });
      return $scope.summ = summ;
    };
    return $scope.onLoad();
  };

  this.Users.$inject = ['$scope', 'Session', '$cookies', '$location', 'itemsFactory', 'storage', '$timeout'];

}).call(this);
(function() {
  angular.module('Shop').directive('counter', [
    'itemsFactory', '$rootScope', function(itemsFactory, $rootScope) {
      return {
        restrict: 'E',
        templateUrl: "../assets/users/directives/counter.html",
        replace: true,
        scope: {
          index: "=",
          itemRaw: "&"
        },
        link: function(scope, element, attrs) {
          scope.inc = function(itemId) {
            return itemsFactory.inc(itemId).then(function(count) {
              scope.index.quantity = count;
              return $rootScope.$broadcast("updatedCart");
            });
          };
          return scope.dec = function(itemId) {
            return itemsFactory.dec(itemId).then(function(count) {
              console.log(count);
              if (count === "deleted") {
                scope.itemRaw({
                  id: itemId
                });
              } else {
                scope.index.quantity = count;
              }
              return $rootScope.$broadcast("updatedCart");
            });
          };
        }
      };
    }
  ]);

}).call(this);
(function() {
  angular.module('Shop').factory('itemsFactory', [
    '$http', '$q', '$rootScope', 'storage', function($http, $q, $rootScope, storage) {
      var data;
      data = {
        items: [
          {
            name: "..."
          }
        ],
        range: [],
        currentPage: 1,
        cart: []
      };
      return {
        getItems: function(search_phrase) {
          if (search_phrase === void 0) {
            search_phrase = '';
          }
          return $http({
            method: 'GET',
            url: '/items',
            params: {
              page: 1,
              search: search_phrase
            }
          });
        },
        getPage: function(n) {
          if (n === void 0) {
            n = 1;
          }
          return $http({
            method: 'GET',
            url: '/items',
            params: {
              page: n
            }
          });
        },
        addToCart: function(item, quantity) {
          var cart, have, index;
          index = {};
          index['id'] = "";
          index['item'] = "";
          index['quantity'] = 0;
          have = false;
          cart = storage.get('cart');
          _.each(cart, function(key) {
            if (key.id === item.id) {
              return have = true;
            }
          });
          if (have) {
            _.map(cart, function(key) {
              if (key.id === item.id) {
                return key.quantity += quantity;
              }
            });
          } else {
            index['id'] = item.id;
            index['item'] = item;
            index['quantity'] = quantity;
            cart.push(index);
          }
          storage.set('cart', cart);
          return $rootScope.$broadcast("updatedCart");
        },
        removeFromCart: function(id) {
          var arr, cart, deferred;
          deferred = $q.defer();
          cart = storage.get('cart');
          arr = _.without(cart, _.findWhere(cart, {
            id: id
          }));
          cart = arr;
          storage.set('cart', cart);
          deferred.resolve();
          $rootScope.$broadcast("updatedCart");
          return deferred.promise;
        },
        inc: function(itemId) {
          var cart, deferred;
          deferred = $q.defer();
          cart = storage.get('cart');
          _.map(cart, function(key) {
            if (key['id'] === itemId) {
              key['quantity']++;
              return deferred.resolve(key['quantity']);
            }
          });
          storage.set('cart', cart);
          return deferred.promise;
        },
        dec: function(itemId) {
          var cart, deferred;
          deferred = $q.defer();
          cart = storage.get('cart');
          _.map(cart, function(key) {
            if (key['id'] === itemId) {
              if (key['quantity'] === 1) {
                cart.splice(cart.indexOf(key), 1);
                storage.set('cart', cart);
                return deferred.resolve("deleted");
              } else if (key['quantity'] > 1) {
                key['quantity']--;
                storage.set('cart', cart);
                return deferred.resolve(key['quantity']);
              }
            }
          });
          return deferred.promise;
        },
        order: function() {
          var cart, dispatcher;
          dispatcher = new WebSocketRails('localhost:3000/websocket');
          cart = storage.get('cart');
          return $http({
            method: 'POST',
            url: '/orders',
            data: {
              cart: cart
            }
          }).success(function(response) {
            dispatcher.trigger('create', 'new order!');
            return console.log(response);
          });
        },
        showCartContent: function() {
          var deferred;
          deferred = $q.defer();
          deferred.resolve(storage.get('cart'));
          return deferred.promise;
        },
        getItem: function(itemId) {
          return $http({
            method: 'GET',
            url: '/items/' + itemId
          });
        }
      };
    }
  ]);

}).call(this);
(function() {
  angular.module("sessionService", ['ngCookies']).factory("Session", function($location, $http, $q, $cookies, $rootScope) {
    var redirect, service;
    redirect = function(url) {
      url = url || "/";
      return $location.path(url);
    };
    service = {
      currentUser: null,
      login: function(email, password) {
        return $http.post("/sessions/login", {
          session: {
            email: email,
            password: password
          }
        }).success(function(response) {
          if (response !== "no") {
            service.currentUser = response;
            $rootScope.$broadcast("event:authenticated");
            if (service.currentUser.admin === true) {
              return $location.path("/admin/items");
            } else {
              return $location.path("/users/profile");
            }
          }
        });
      },
      logout: function(redirectTo) {
        return $http.post("/sessions/logout").success(function() {
          service.currentUser = null;
          $rootScope.$broadcast("loggedOut");
          return redirect(redirectTo);
        });
      },
      register: function(email, password, confirm_password) {
        return $http.post("/users", {
          user: {
            email: email,
            password: password,
            password_confirmation: confirm_password
          }
        }).success(function(response) {
          if (!response.errors) {
            service.currentUser = response;
            console.log(service.currentUser);
            $rootScope.$broadcast("event:authenticated");
            if (service.currentUser.admin === true) {
              return $location.path("/admin/items");
            } else {
              return $location.path("/users/profile");
            }
          }
        }).error(function() {
          return console.log("error ocurred");
        });
      },
      requestCurrentUser: function() {
        return $http.get("/sessions/currentUser").success(function(response) {
          service.currentUser = response;
          return $rootScope.$broadcast("currentUser", response);
        });
      },
      isAuthenticated: function() {
        return $http.get("/sessions/isAuthenticated");
      }
    };
    return service;
  });

}).call(this);
