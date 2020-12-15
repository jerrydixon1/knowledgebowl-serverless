'use strict';

angular.module('knowledgebowl').directive('kbEditUser', function ($modal, $api, toastr, _, $rootScope) {
  return {
    scope: {
      user: '='
    },
    link: function (scope, element, attrs) {
      element.on('click', function ($event) {
        if(angular.element($event.target).hasClass('btn') || angular.element($event.target).hasClass('toggle-on') || angular.element($event.target).hasClass('toggle-off') || angular.element($event.target).hasClass('toggle-handle')) {
          return;
        }
        var modal = $modal({
          controller: function () {
            var ctrl = this;
            ctrl.user = _.cloneDeep(scope.user);
            ctrl.editUser = function () {
              ctrl.editingUser = true;
              if(ctrl.editUserForm.$valid) {
                if(!ctrl.user.password_reset_expiration) {
                  ctrl.user.password_reset_expiration = undefined;
                }
                $api.user.edit(ctrl.user).then(function () {
                  toastr.success('Successfully edited user!');
                  $rootScope.$emit('user_list_reload');
                  modal.hide();
                }).catch(function () {
                  toastr.error('Error editing user. Please contact support.');
                  modal.hide();
                }).finally(function () {
                  ctrl.editingUser = false;
                });
              }
            };
            ctrl.deleteUser = function () {
              ctrl.editingUser = true;
              $api.user.deleteUser(ctrl.user.id).then(function () {
                toastr.success('Successfully deleted user.');
                $rootScope.$emit('user_list_reload');
                modal.hide();
              }).catch(function () {
                toastr.error('Error deleting user. Please contact support.');
                modal.hide();
              }).finally(function () {
                ctrl.editingUser = false;
              });
            };
            ctrl.close = function () {
              modal.hide();
            };
          },
          controllerAs: 'ctrl',
          templateUrl: 'views/modals/edit-user.html',
          show: false
        });
        modal.$promise.then(modal.show);
      });
    }
  };
});
