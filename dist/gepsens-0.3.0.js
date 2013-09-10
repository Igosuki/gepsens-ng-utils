angular.module("gepsens", ["gepsens.auth","gepsens.autogrow","gepsens.badges","gepsens.checkbox","gepsens.feedback","gepsens.paginate","gepsens.tracker"]);
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

angular.module("gepsens.autogrow", []).directive('autogrow', function() {
  return function(scope, element, attr){
    var minWidth = element[0].offsetWidth,
      paddingLeft = element.css('padding-left'),
      paddingRight = element.css('padding-right');

    // style the mirror
    var $mirror = angular.element('<div></div>').css({
      'font-size'         : element.css('font-size'),
      'font-family'       : element.css('font-family'),
      'height'             : element.css('height'),
      'padding-left'      : element.css('padding-left'),
      'padding-right'     : element.css('padding-right'),
      'padding-bottom'    : element.css('padding-bottom'),
      'padding-top'       : element.css('padding-top'),
      'border'            : element.css('border'),
      'position'          : 'absolute',
      'top'               : '-10000px',
      'left'              : '-10000px',
      'white-space'       : 'pre-wrap',
      'word-wrap'         : 'break-word',
      'box-sizing'          : element.css('box-sizing'),
      '-moz-box-sizing'     : element.css('-moz-box-sizing'),
      '-webkit-box-sizing'  : element.css('-webkit-box-sizing'),
      'line-height'         : element.css('line-height')

    });

    // create the mirror
    angular.element(document.body).append($mirror);

    // update the mirror
    var update = function() {
      var times = function(string, number) {
        for (var i = 0, r = ''; i < number; i++) {
          r += string;
        }
        return r;
      };

      // send content to the mirror
      var val = element.val().replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;')
        .replace(/\n$/, '<br/>&nbsp;')
        .replace(/\n/g, '<br/>')
        .replace(/\s{2,}/g, function(space) { 
          return times('&nbsp;', space.length - 1) + ' ';
        });
      $mirror.html(val);

      // sync mirror width
      $mirror.css('height', element.css('height'));
      element.css('width', Math.max($mirror[0].offsetWidth + 10 /* the "threshold" */, minWidth) + 'px');
      element.css('overflow', 'hidden');
    };

    // bind to keypresses and window width changes
    element.bind('keyup keydown keypress change', update);
    update();
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
        $scope.focusInput = function() {
          element.find('input').focus();
        };
        $scope.validateAndPush = function(list, item) {
          if(item && item !== '' && list && list.indexOf(item) < 0) {
            list.push(item);
          }
        };
      }
    };
  })
  .directive('list-feed', function() {
    return {
      restrict: 'A',
      scope: {
        listFeed: '='
      },
      link: function($scope, element, attrs, ctrl) {
        
      }
    };
  });
angular.module('gepsens.checkbox', [])
	.directive('flatCheckbox', [function(){
	return {
		scope: {
			value : "="
		},
		template: 
			'<span class="checkbox" ng-class="{true: \'checked\'}[value]">'+
				'<span class="icons" ng-click="value = !value">'+
					'<span class="icon-unchecked first-icon"></span>'+
					'<span class="icon-check second-icon"></span>'+
				'</span>'+
				'<input type="checkbox" data-toggle="checkbox" ng-model="value" />'+
				'<span style="width: 100%;" ng-transclude></span>'+
			'</span>',
		replace: true,
		transclude: true,
		restrict: 'E',
		link: function($scope, iElm, iAttrs, controller) {
			if($scope.value === undefined) {
				$scope.value = false;
			}
		}
	};
}]);
angular.module('gepsens.feedback', [])
	.directive('btnFeedback', ['promiseTracker', function(promiseTracker){
	return {
		scope: {
			btnFeedback : "=",
			tracker: "@"
		},
		template: "<button ng-transclude ng-class=\"{'error': 'btn-danger icon-meh', 'done': 'btn-success icon-ok', 'doing': 'icon-spinner icon-spin'}[btnFeedback]\"></button>",
		replace: true,
		transclude: true,
		restrict: 'A',
		
		link: function($scope, iElm, iAttrs, controller) {	
			if($scope.tracker) {
				promiseTracker($scope.tracker).on('start', function() {
					btnFeedback = 'doing';
				}).on('done', function(response) {
					btnFeedback = 'done';
				}).on('error', function(response) {
					btnFeedback = 'error';
				});
			}
		}
	};
}]);
angular.module("gepsens.paginate", []).filter('paginate', ['$filter', function ($filter) {
   return function(input, current_page, page_size) {
      if (input) {
          return $filter('limitTo')(input.slice(current_page * page_size), page_size);
      }
   };
}]);
angular.module('gepsens.tracker', [])
	.factory('httpRequestTracker', ['$http', function($http){

	var httpRequestTracker = {};
	httpRequestTracker.hasPendingRequests = function() {
	return $http.pendingRequests.length > 0;
	};

	return httpRequestTracker;
}]);