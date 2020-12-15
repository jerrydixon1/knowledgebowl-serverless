'use strict';

angular.module('knowledgebowl').directive('equalTo', function () {
  return {
    scope: {
      val: '=ngModel',
      compareVal: '=equalTo'
    },
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {

      var determineValidity = function () {
        ctrl.$setValidity('value_compare', scope.val === scope.compareVal);
      };

      scope.$watch('val', determineValidity);
      scope.$watch('compareVal', determineValidity);

    }
  };
});
