angular.module("gepsens.paginate", []).filter('paginate', ['$filter', function ($filter) {
   return function(input, current_page, page_size) {
      if (input) {
          return $filter('limitTo')(input.slice(current_page * page_size), page_size);
      }
   };
}]);