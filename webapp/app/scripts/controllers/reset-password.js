'use strict';

/**
 * @ngdoc function
 * @name knowledgebowl.controller:ResetPasswordCtrl
 * @description
 * # ResetPasswordCtrl
 * Reset Password Controller of the knowledgebowl app
 */
angular.module('knowledgebowl').controller('ResetPasswordCtrl', function (AuthenticationService, $location, $api, authorizedToken) {
  var self = this;
  if(!authorizedToken) {
    self.authorizeError = true;
  }

  self.submit = function () {
    if(self.resetPasswordForm.$valid) {
      self.submittingForm = true;
      $api.auth.resetPassword({
        passwordResetToken: authorizedToken,
        newPassword: self.password
      }).then(function () {
        self.submitSuccess = true;
      }).catch(function (err) {
        self.submitFailed = true;
      }).finally(function () {
        self.submittingForm = false;
      });
    }
  };
});
