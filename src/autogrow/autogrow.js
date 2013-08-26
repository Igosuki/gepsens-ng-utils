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