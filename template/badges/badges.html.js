angular.module("template/badges/badges.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/badges/badges.html",
    "<span class=\"tag\" data-ng-repeat=\"badge in badgeList\">\n" +
    "  <span>{{badge}}</span>\n" +
    "  <a class=\"tagsinput-remove-link\" ng-show=\"!simple\" ng-click=\"remove($index)\"> <i class=\"icon-remove\" ></i></a>\n" +
    "</span>");
}]);
