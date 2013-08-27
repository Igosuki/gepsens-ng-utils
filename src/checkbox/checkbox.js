angular.module('gepsens.checkbox', [])
	.directive('flatCheckbox', [function(){
	return {
		scope: {
			value : "="
		},
		template: 
			'<label class="checkbox" ng-class="{true: \'checked\'}[value]">'+
				'<span class="icons">'+
					'<span ng-class="{true: \'icon-unchecked first-icon\', false: \'icon-check second-icon\'}[value]"></span>'+
				'</span>'+
				'<input type="checkbox" ng-model="value" />'+
			'</label>',
		replace: true,
		transclude: true,
		restrict: 'E',
		link: function($scope, iElm, iAttrs, controller) {
			if($scope.value == undefined) {
				$scope.value = false;
			}
		}
	};
}]);