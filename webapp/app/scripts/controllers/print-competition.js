'use strict';

angular.module('knowledgebowl').controller('PrintCompetitionCtrl', function ($window, questions) {
  var ctrl = this;
  ctrl.questions = questions;

  ctrl.print = function () {
    $window.print(); // Print the current HTML page. Print formatting is done with print.css
  };

});
