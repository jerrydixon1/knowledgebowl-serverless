'use strict';

/**
 * @ngdoc function
 * @name knowledgebowl.controller:ManageWelcomePageCtrl
 * @description
 * # ManageWelcomePageCtrl
 * Welcome Page Management Controller of the knowledgebowl
 */
angular.module('knowledgebowl').controller('ManageWelcomePageCtrl', function ($api, toastr, welcomeHtml) {

  var ctrl = this;

  ctrl.welcomeHtml = welcomeHtml;
  ctrl.originalWelcomeHtml = welcomeHtml;

  ctrl.save = function () {
    ctrl.saving = true;
    $api.customizablePage.edit('welcome-page.html', ctrl.welcomeHtml).then(function () {
      ctrl.originalWelcomeHtml = ctrl.welcomeHtml;
      toastr.success('Successfully edited welcome page');
    }).catch(function () {
      toastr.error('An error occurred while saving changes');
    }).finally(function () {
      ctrl.saving = false;
    });
  };

  ctrl.reset = function () {
    ctrl.welcomeHtml = ctrl.originalWelcomeHtml;
  }

});
