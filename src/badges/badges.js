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