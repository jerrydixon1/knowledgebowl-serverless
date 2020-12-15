'use strict';

/**
 * @ngdoc function
 * @name knowledgebowl.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of knowledgebowl
 */
angular.module('knowledgebowl').controller('MainCtrl', function (welcomeHtml) {
  this.welcomeHtml = welcomeHtml;
});
