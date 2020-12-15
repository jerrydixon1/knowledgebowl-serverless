'use strict';

/**
 * @ngdoc function
 * @name knowledgebowl.controller:ManageUsersCtrl
 * @description
 * # ManageUsersCtrl
 * User Management Controller of the knowledgebowl
 */
angular.module('knowledgebowl').controller('ManageUsersCtrl', function (AuthenticationService, $location, $api, toastr, users, $timeout, $q, $rootScope) {

  var ctrl = this;

  ctrl.users = users;

  ctrl.addUser = function(e) {
    e.preventDefault();
    if(ctrl.addUserForm.$valid) {
      ctrl.savingUser = true;
      $api.auth.registerNewUser(ctrl.newUser).then(function () {
        ctrl.newUser = {};
        ctrl.addUserForm.$setPristine();
        toastr.success('New user registered!');

        $rootScope.$emit('user_list_reload');

      }).catch(function () {
        toastr.error('Error registering user. Please contact support.');
      }).finally(function () {
        ctrl.savingUser = false;
      });
    }
  };

  ctrl.resendUserCreationLink = function (user) {
    if(user.requires_password_reset) {
      ctrl.resendingCreationEmail = true;
      $api.auth.resendCreationEmail(user.id).then(function () {
        toastr.success('Re-sent email to ' + user.username);
      }).catch(function () {
        toastr.error('Error occurred re-sending email to ' + user.username + '. Please contact support.');
      }).finally(function () {
        ctrl.resendingCreationEmail = false;
      });
    } else {
      toastr.error('User has already setup their account. Please ask them to click "Forget your password?" from the login screen.');
    }
  };

  var delayToggle = undefined;
  var deferToggle = undefined;
  ctrl.toggleActive = function(user) {
    if(delayToggle) {
      $timeout.cancel(delayToggle);
    }
    delayToggle = $timeout(function () {
      if(deferToggle) {
        deferToggle.resolve();
      }
      deferToggle = $q.defer();
      $api.user.toggleActive(user, {
        timeout: deferToggle.promise
      });
    }, 1000);
  };

  $rootScope.$on('user_list_reload', function () {
    $api.user.list().then(function (response) {
      ctrl.users = response.data;
    });
  });

});
