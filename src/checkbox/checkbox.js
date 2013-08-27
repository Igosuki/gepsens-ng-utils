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