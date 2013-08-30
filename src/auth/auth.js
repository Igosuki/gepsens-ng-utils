angular.module('gepsens.auth', ['ngCookies', 'ngResource'])
  .provider('Auth', function() {

    this.$get = function ($http, $resource, $cookieStore, $q, $window, $cookies, $location) {
        var authResource = $resource('auth/:provider', {

        }, {
            'authenticate' : {
                method: 'GET'
            }
        });
        var userResource = $resource('users/:id');
        var resolveUser = function(result, callback) {
            service.currentUser = result;
            service.currentUser.isLoggedIn = true;
            if(callback) {
                callback(service.currentUser);
            }
            return service.currentUser;
        };

        var service = {
            isAuthenticated: function() {return !!service.currentUser;},
            currentUser: null,
            setCurrentUser: function(user) {
                service.currentUser = user;
            },
            requestCurrentUser: function(callback) {
              if (service.isAuthenticated() ) {
                return service.currentUser;
              } else {
                return service.authenticate(callback);
              }
            },
            authenticate : function(callback) {
                return $http.get('auth', {withCredentials: true}).success(function(data, status, header, config) {
                    return resolveUser(data, callback);
                });
            },
            logout: function() {
                $http.get('/logout');
            },
            login: function(email, password, callback) {
                return $http.post('/login', {username: email, password: password}).success(function(res) {
                    return resolveUser(res, callback);
                });
            },
            loginOauth: function(type, callback) {
                if(type.trim() === '') {
                    return service.authenticate(callback);
                } else {
                    window.location.href = 'auth/' + type + '?callback='+window.location.href;
                }
            },
            users: function() {
                return userResource.query();
            }
        };

        return service;
      };
    });
