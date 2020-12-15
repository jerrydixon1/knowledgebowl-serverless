'use strict';

angular.module('knowledgebowl').directive('kbQuestionModal', function ($modal, $api, toastr, _, $rootScope) {
  return {
    scope: {
      question: '=',
      categories: '='
    },
    link: function (scope, element, attrs) {
      element.on('click', function () {
        var modal = $modal({
          controller: function () {
            var ctrl = this;

            ctrl.question = scope.question ? _.cloneDeep(scope.question) : ctrl.question;
            ctrl.categories = scope.categories;

            ctrl.save = function () {
              if(ctrl.questionForm.$valid) {
                ctrl.saving = true;
                if(ctrl.question.id) {
                  $api.question.edit(ctrl.question).then(function () {
                    toastr.success('Successfully edited question!');
                    $rootScope.$emit('question_list_reload');
                    modal.hide();
                  }).catch(function () {
                    toastr.error('Error editing question. Please contact support.');
                    modal.hide();
                  }).finally(function () {
                    ctrl.saving = false;
                  });
                } else {
                  $api.question.create(ctrl.question).then(function () {
                    toastr.success('Successfully added question!');
                    $rootScope.$emit('question_list_reload');
                    modal.hide();
                  }).catch(function () {
                    toastr.error('Error saving question. Please contact support.');
                    modal.hide();
                  }).finally(function () {
                    ctrl.saving = false;
                  });
                }
              }
            };

            ctrl.deleteQuestion = function () {
              if(confirm('Are you sure you want to delete this question? This can\'t be undone.')) {
                ctrl.saving = true;
                $api.question.deleteQuestion(ctrl.question.id).then(function () {
                  toastr.success('Successfully deleted question.');
                  $rootScope.$emit('question_list_reload');
                  modal.hide();
                }).catch(function () {
                  toastr.error('Error deleting question. Please contact support.');
                  modal.hide();
                }).finally(function () {
                  ctrl.saving = false;
                });
              }
            };

            ctrl.close = function () {
              modal.hide();
            };
          },
          controllerAs: 'ctrl',
          templateUrl: 'views/modals/question-form.html',
          show: false
        });
        modal.$promise.then(modal.show);
      });
    }
  };
});
