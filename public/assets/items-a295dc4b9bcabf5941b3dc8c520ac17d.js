(function() {
  var Shop;

  Shop = angular.module('Shop', ['ngRoute', 'sessionService', 'angularFileUpload', 'ui.router', 'angularLocalStorage']);

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
      return $stateProvider.state("admin", {
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
      }).state("users", {
        url: "/users",
        templateUrl: "../assets/users/users.html",
        controller: "Users"
      }).state("users.signup", {
        url: "/signup",
        templateUrl: "../assets/users/users.signup.html",
        controller: "Signup"
      }).state("users.login", {
        url: "/login",
        templateUrl: "../assets/users/users.login.html",
        controller: "Login"
      }).state("users.profile", {
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
    }
  ]);

}).call(this);
(function() {
  this.Admin = function($scope, $http, users) {
    users.getAllUsers();
    return $scope.users = users;
  };

  this.Admin.$inject = ['$scope', '$http', 'users'];

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
      }).success(function() {
        return $location.url("admin/items");
      }).error(function(data) {
        return console.log(data.errors);
      });
    };
  };

  this.AdminCreateItem.$inject = ['$scope', '$location', '$upload'];

}).call(this);
(function() {
  this.AdminItems = function($scope, $http, $location, itemData, $state, $route) {
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

  this.AdminItems.$inject = ['$scope', '$http', '$location', 'itemData', '$state', '$route'];

}).call(this);
(function() {
  this.AdminShowItem = function($scope, $location, $stateParams, itemData) {
    $scope.item = '';
    $scope.itemId = $stateParams.itemId;
    return itemData.getItem($scope.itemId).then(function(response) {
      return $scope.item = response;
    });
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
      }).success(function() {
        return $location.url("admin/items");
      }).error(function(data) {
        return console.log(data.errors);
      });
    };
  };

  this.AdminUpdateItem.$inject = ['$scope', 'itemData', '$stateParams', '$upload', '$location'];

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
        currentPage: 1
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
  this.Items = function($scope, $http, $location, itemsFactory) {
    $scope.items = [
      {
        name: 'Loading...'
      }
    ];
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.getItems = function(search_phrase) {
      return itemsFactory.getItems(search_phrase).then(function(data) {
        $scope.items = data.items;
        $scope.currentPage = data.currentPage;
        $scope.range = data.range;
        if (search_phrase !== void 0) {
          $scope.itemsCount = "found " + data.items_count + " items";
        }
        if (data.items_count === 0) {
          return $scope.itemsCount = "no such item in store";
        }
      }, function() {
        return console.log("error in items");
      });
    };
    $scope.getItems();
    $scope.getPage = function(n) {
      return itemsFactory.getPage(n).then(function(data) {
        $scope.items = data.items;
        $scope.currentPage = data.currentPage;
        $scope.range = data.range;
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
    return $scope.showItem = function(id) {
      return $location.path("/users/items/" + id);
    };
  };

  this.Items.$inject = ['$scope', '$http', '$location', 'itemsFactory'];

}).call(this);
(function() {
  this.Login = function($scope, Session, $location) {
    Session.isAuthenticated().then(function() {
      return $location.url("/users/items");
    });
    return $scope.logIn = function(email, password) {
      return Session.login(email, password).then(function() {
        return console.log("success");
      }, function() {
        return $scope.authError = "credentials are not valid!";
      });
    };
  };

  this.Login.$inject = ['$scope', 'Session', '$location'];

}).call(this);
(function() {
  this.Profile = function($scope, $location, Session) {
    Session.isAuthenticated().then(function() {
      return console.log("chudno");
    }, function() {
      return $location.url("/users/items");
    });
    $scope.currentUser = Session.currentUser;
    return $scope.$on("currentUser", function(event, response) {
      return $scope.currentUser = response;
    });
  };

  this.Profile.$inject = ['$scope', '$location', 'Session'];

}).call(this);
(function() {
  this.ShowCart = function($scope, itemsFactory) {
    $scope.showCartContent = function() {
      return itemsFactory.showCartContent().then(function(cart) {
        if (cart.length > 0) {
          console.log(cart);
          return $scope.cart = cart;
        } else {
          return $scope.message = "Your basket is currently empty. Take advantage of our catalog to fill it.";
        }
      });
    };
    $scope.showCartContent();
    return $scope.removeFromCart = function(id) {
      return itemsFactory.removeFromCart(id);
    };
  };

  this.ShowCart.$inject = ['$scope', 'itemsFactory'];

}).call(this);
(function() {
  this.ShowItem = function($scope, itemsFactory, $stateParams, storage) {
    var itemId;
    $scope.item = "loading...";
    itemId = $stateParams.itemId;
    itemsFactory.getItem(itemId).then(function(response) {
      return $scope.item = response;
    });
    return $scope.addToCart = function(item) {
      var quantity;
      quantity = 1;
      return itemsFactory.addToCart(item, quantity);
    };
  };

  this.ShowItem.$inject = ['$scope', 'itemsFactory', '$stateParams', 'storage'];

}).call(this);
(function() {
  this.Signup = function($scope, Session, $location) {
    Session.isAuthenticated().then(function() {
      return $location.url("/users/items");
    });
    return $scope.signup = function(email, password, password_confirmation) {
      return Session.register(email, password, password_confirmation);
    };
  };

  this.Signup.$inject = ['$scope', 'Session', '$location'];

}).call(this);
(function() {
  this.Users = function($scope, Session, $cookies, $location, itemsFactory, storage) {
    $scope.currentUser = null;
    $scope.$on("event:authenticated", function(event) {
      return $scope.currentUser = Session.currentUser;
    });
    $scope.$on("event:unauthorized", function(event) {
      return console.log("unauthorized");
    });
    $scope.$on("loggedOut", function(event) {
      return $scope.currentUser = null;
    });
    $scope.$on("currentUser", function(event, response) {
      return $scope.currentUser = response;
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
    $scope.$on("addedToCart", function(event, cart) {
      $scope.cart = cart;
      $scope.count = $scope.cart.length;
      if (($scope.count === 0) || ($scope.count > 1)) {
        $scope.item = "items";
      } else {
        $scope.item = "item";
      }
      return _.each($scope.cart, function(key) {
        return $scope.summ += key['item'].price;
      });
    });
    $scope.onLoad = function() {
      console.log(storage.get('cart'));
      $scope.cart = storage.get('cart');
      $scope.count = $scope.cart.length;
      if (($scope.count === 0) || ($scope.count > 1)) {
        $scope.item = "items";
      } else {
        $scope.item = "item";
      }
      return _.each($scope.cart, function(key) {
        return $scope.summ += key['item'].price;
      });
    };
    return $scope.onLoad();
  };

  this.Users.$inject = ['$scope', 'Session', '$cookies', '$location', 'itemsFactory', 'storage'];

}).call(this);
(function() {
  angular.module('Shop').directive('counter', [
    'itemsFactory', function(itemsFactory) {
      return {
        restrict: 'EA',
        templateUrl: "../assets/users/directives/counter.html",
        replace: true,
        scope: {
          index: "="
        },
        link: function(scope, element, attrs) {
          scope.inc = function(itemId) {
            return itemsFactory.inc(itemId).then(function(count) {
              return scope.index.item.count = count;
            });
          };
          return scope.dec = function(itemId) {
            return itemsFactory.dec(itemId).then(function(count) {
              return scope.index.item.count = count;
            });
          };
        }
      };
    }
  ]);

}).call(this);
(function() {
  angular.module("Shop").factory('DataCache', [
    '$cacheFactory', function($cacheFactory) {
      return $cacheFactory("dataCache", {});
    }
  ]);

  angular.module('Shop').factory('itemsFactory', [
    '$http', '$q', 'DataCache', '$rootScope', 'storage', function($http, $q, DataCache, $rootScope, storage) {
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
        },
        getPage: function(n) {
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
        },
        addToCart: function(item, quantity) {
          var have, index;
          index = {};
          index['id'] = "";
          index['item'] = "";
          index['quantity'] = 0;
          have = false;
          _.each(data.cart, function(key) {
            if (key.id === item.id) {
              return have = true;
            }
          });
          if (have) {
            _.map(data.cart, function(key) {
              if (key.id === item.id) {
                return key.quantity += quantity;
              }
            });
          } else {
            index['id'] = item.id;
            index['item'] = item;
            index['quantity'] = quantity;
            data.cart.push(index);
          }
          storage.set('cart', data.cart);
          return $rootScope.$broadcast("addedToCart", data.cart);
        },
        inc: function(itemId) {
          var deferred;
          deferred = $q.defer();
          _.map(data.cart, function(key) {
            if (key['id'] = itemId) {
              return key['count']++;
            }
          });
          deferred.resolve();
          return deferred.promise;
        },
        dec: function(itemId) {
          var deferred;
          deferred = $q.defer();
          _.map(data.cart, function(key) {
            if (key['id'] = itemId) {
              return key['count']--;
            }
          });
          deferred.resolve();
          return deferred.promise;
        },
        showCartContent: function() {
          var deferred;
          deferred = $q.defer();
          deferred.resolve(data.cart);
          return deferred.promise;
        },
        getItem: function(itemId) {
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
        }
      };
    }
  ]);

}).call(this);
(function() {
  angular.module("sessionService", ['ngCookies']).factory("Session", function($location, $http, $q, $cookies, $rootScope, DataCache) {
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
            return $location.path("/users/profile");
          }
        });
      },
      logout: function(redirectTo) {
        return $http.post("/sessions/signout").then(function() {
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
          service.currentUser = response;
          console.log(service.currentUser);
          $rootScope.$broadcast("event:authenticated");
          return $location.path("/users/profile");
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
        var deferred;
        deferred = $q.defer();
        $http.get("/sessions/isAuthenticated").success(function(state) {
          return deferred.resolve();
        }).error(function() {
          return deferred.reject();
        });
        return deferred.promise;
      }
    };
    return service;
  });

}).call(this);
