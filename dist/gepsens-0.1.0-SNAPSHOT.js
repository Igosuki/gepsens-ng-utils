angular.module("gepsens", ["gepsens.auth","gepsens.autogrow","gepsens.badges","gepsens.feedback"]);
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
angular.module('gepsens.feedback', [])
	.directive('btnFeedback', [function(){
	return {
		scope: {
			btnFeedback : "="
		},
		template: "<button ng-transclude ng-class=\"{'error': 'btn-danger', 'done': 'btn-success icon-ok', 'doing': 'icon-spinner icon-spin'}[btnFeedback]\"></button>",
		replace: true,
		transclude: true,
		restrict: 'A',
		link: function($scope, iElm, iAttrs, controller) {	
		}
	};
}]);