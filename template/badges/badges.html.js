angular.module("template/badges/badges.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/badges/badges.html",
    "<div class=\"tagsinput tagsinput-primary fitcontent form-control\">\n" +
    "	<span class=\"tag\" data-ng-repeat=\"badge in badgeList\">\n" +
    "	  <span>{{badge}}</span>\n" +
    "	  <a class=\"tagsinput-remove-link\" ng-show=\"!simple\" ng-click=\"remove($index)\"> <i class=\"icon-remove\" ></i></a>\n" +
    "	</span>\n" +
    "	<div class=\"tagsinput-add-container\">\n" +
    "		<div class=\"tagsinput-add\" ng-click=\"focusInput()\">\n" +
    "			<i class=\"icon-plus\"></i>\n" +
    "		</div>\n" +
    "		<input class=\"input-sm\" type='text' autogrow name=\"badgeListCmpl\" ng-model=\"badgeListCmpl\" ui-keydown=\"{'enter': 'validateAndPush(badgeList,badgeListCmpl)'}\" />\n" +
    "	</div>\n" +
    "</div>");
}]);
