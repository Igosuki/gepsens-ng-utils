angular.module("gepsens", ["gepsens.tpls", "gepsens.auth","gepsens.badges"]);
angular.module("gepsens.tpls", ["template/badges/badges.html"]);
angular.module('gepsens.auth', ['ngCookies', 'ngResource'])
  .provider('Auth', function() {

    this.$get = function ($http, $resource, $cookieStore, $q, $window, $cookies) {
        var authResource = $resource('auth/:provider', {

        }, {
            'authenticate' : {
                method: 'GET'
            }
        });
        var userResource = $resource('users/:id');
        var currentUser = $cookieStore.get("user") || {};

        var resolveUser = function(result, callback) {
            self.currentUser = result;
            self.currentUser.isLoggedIn = true;
            $cookieStore.put("user", self.currentUser);
            $cookieStore.remove("user");
            if(callback) {
                callback(self.currentUser);
            }
        };

        return {
            currentUser: currentUser,
            setCurrentUser: function(user) {
                currentUser = user;
            },
            logout: function() {
                $http.get('/logout');
            },
            login: function(email, password, callback) {
                var self = this;
            return $http.post('/login', {username: email, password: password}).success(function(res) {
                    resolveUser(res, callback);
                });
            },
            loginOauth: function(type, callback) {
                if(type.trim() === '') {
                    return $http.get('auth', {withCredentials: true}).success(function(data, status, header, config) {
                      resolveUser(data, callback);
                    });
                } else {
                    window.location.href = 'auth/' + type;
                }
            },
            users: function() {
            return userResource.query();
            }
        };
      };
    });

angular.module('gepsens.badges', [])
  .directive('badges', function() {
    return {
      scope: {
        badgeList : '=',
        badgeClass : '@',
        badgeControl: '@',
        simple: '='
      },
      templateUrl: "template/badges/badges.html",
      restrict: 'E',
      controller: function($scope, $attrs, $parse) {
        $scope.remove = function(index) {
          $scope.badgeList.splice(index, 1);
        };
      },
      link: function($scope, element, attrs, ctrl) {
        $scope.$watch('badgeList', function(newVal, oldVal) {
          if($scope.$parent.form) {
            if(newVal && oldVal && !(newVal && newVal.length > 0)) {
              $scope.$parent.form.$setValidity($scope.badgeControl, false);
            } else {
              $scope.$parent.form.$setValidity($scope.badgeControl, true);
            }
          }
        }, true);
      }
    };
  });
angular.module("template/badges/badges.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/badges/badges.html",
    "<span class=\"tag\" data-ng-repeat=\"badge in badgeList\">\n" +
    "  <span>{{badge}}</span>\n" +
    "  <a class=\"tagsinput-remove-link\" ng-show=\"!simple\" ng-click=\"remove($index)\"> <i class=\"icon-remove\" ></i></a>\n" +
    "</span>");
}]);
