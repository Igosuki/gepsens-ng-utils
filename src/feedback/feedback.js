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