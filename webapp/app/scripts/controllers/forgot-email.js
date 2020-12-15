'use strict';

/**
 * @ngdoc function
 * @name knowledgebowl.controller:ForgotEmailCtrl
 * @description
 * # ForgotEmailCtrl
 * Forgot Email Controller of the knowledgebowl app
 */
angular.module('knowledgebowl').controller('ForgotEmailCtrl', function (AuthenticationService, $location, $api) {
  var self = this;

  self.emails = [];
  self.getEmails = function () {
    if(self.forgotEmailForm.$valid) {
      $api.user.listByName(self.user).then(function (response) {
        _.each(response.data, function (email) {
          self.emails.push(email);
        });
      }).catch(function () {
        self.searchError = true;
      }).finally(function () {
        self.searchComplete = true;
      });
    }
  };

});
