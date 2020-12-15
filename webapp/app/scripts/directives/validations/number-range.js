'use strict';

angular.module('knowledgebowl').directive('numberRange', function () {
  return {
    scope: {
      min: '=?',
      max: '=',
      val: '=ngModel'
    },
    require: 'ngModel',
    link: function (scope) {
      if(!scope.min) {
        scope.min = 1;
      }

      var formatValue = function () {
        var val = scope.val;
        if(val > scope.max) {
          val = scope.max;
        } else if (val < scope.min) {
          val = scope.min;
        } else if (val === undefined) {
          val = scope.min;
        }
        if(val !== scope.val) {
          scope.val = val;
        }
      };

      scope.$watch('val', formatValue);
      scope.$watch('min', formatValue);
      scope.$watch('max', formatValue);

    }
  };
});
