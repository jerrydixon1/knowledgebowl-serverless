'use strict';

angular.module('knowledgebowl').directive('kbCategoryModal', function ($modal, $api, toastr, _, $rootScope) {
  return {
    scope: {
      category: '='
    },
    link: function (scope, element, attrs) {
      element.on('click', function () {
        var modal = $modal({
          controller: function () {
            var ctrl = this;

            ctrl.category = scope.category ? _.cloneDeep(scope.category) : ctrl.category;

            ctrl.save = function () {
              if(ctrl.categoryForm.$valid) {
                ctrl.saving = true;
                if(ctrl.category.id) {
                  $api.category.edit(ctrl.category).then(function () {
                    toastr.success('Successfully edited category!');
                    $rootScope.$emit('category_list_reload');
                    $rootScope.$emit('question_list_reload');
                    modal.hide();
                  }).catch(function () {
                    toastr.error('Error editing category. Please contact support.');
                    modal.hide();
                  }).finally(function () {
                    ctrl.saving = false;
                  });
                }
                else {
                  $api.category.create(ctrl.category).then(function () {
                    toastr.success('Successfully added category!');
                    $rootScope.$emit('category_list_reload');
                    $rootScope.$emit('question_list_reload');
                    modal.hide();
                  }).catch(function () {
                    toastr.error('Error saving category. Please contact support.');
                    modal.hide();
                  }).finally(function () {
                    ctrl.saving = false;
                  });
                }
              }
            };

            ctrl.deleteCategory = function () {
              if(confirm('WARNING: Deleting a category deletes all questions associated with it. This cannot be undone. Are you sure you want to continue?')) {
                ctrl.saving = true;
                $api.category.remove(ctrl.category.id).then(function () {
                  toastr.success('Successfully deleted category.');
                  $rootScope.$emit('category_list_reload');
                  $rootScope.$emit('question_list_reload');
                  modal.hide();
                }).catch(function () {
                  toastr.error('Error deleting category. Please contact support.');
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
          templateUrl: 'views/modals/category-form.html',
          show: false
        });
        modal.$promise.then(modal.show);
      });
    }
  };
});
