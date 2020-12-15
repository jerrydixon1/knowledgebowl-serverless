'use strict';

/**
 * @ngdoc function
 * @name knowledgebowl.controller:ForgotPasswordCtrl
 * @description
 * # ForgotPasswordCtrl
 * Forgot Password Controller of the knowledgebowl app
 */
angular.module('knowledgebowl').controller('ForgotPasswordCtrl', function (AuthenticationService, $location, $api) {
  var self = this;
  self.submit = function () {
    if(self.forgotPasswordForm.$valid) {
      self.submittingForm = true;
      $api.auth.sendForgotPasswordEmail(self.username).then(function () {
        self.submitSuccess = true;
      }).catch(function (err) {
        self.submitFailed = true;
      }).finally(function () {
        self.submittingForm = false;
      });
    }
  };
});
