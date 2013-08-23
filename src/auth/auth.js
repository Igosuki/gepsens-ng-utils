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
