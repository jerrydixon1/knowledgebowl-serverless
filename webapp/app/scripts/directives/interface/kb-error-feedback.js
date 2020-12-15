'use strict';

angular.module('knowledgebowl').directive('kbErrorFeedback', function ($compile) {
  return {
    scope: true,
    terminal: true,
    priority: 1,
    link: function(scope, element, attrs) {
      var formName = attrs.name;

      var formGroups = element[0].querySelectorAll('.form-group');
      if(formGroups && formGroups.length) {

        for(var i = 0; i < formGroups.length; i++) {
          var formGroup = formGroups[i];

          // Add ng-class to the input
          var input = (formGroup.querySelector('input') || formGroup.querySelector('select') || formGroup.querySelector('textarea'));
          if (input) {
            var inputName = (formGroup.querySelector('input') || formGroup.querySelector('select') || formGroup.querySelector('textarea')).name;
            angular.element(formGroup).attr('ng-class', '{\'has-error\': ' + formName + '.$submitted && ' + formName + '.' + inputName + '.$invalid}');
          }

          // Add ng-show to the ng-messages
          var ngMessages = formGroup.querySelector('div[ng-messages]');
          if(ngMessages) {
            angular.element(ngMessages).attr('ng-show', formName + '.$submitted');
          }

        }
      }
      element.removeAttr('kb-error-feedback');
      $compile(element)(scope);
    }
  };
});
