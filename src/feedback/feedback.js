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