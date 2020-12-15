'use strict';

angular.module('knowledgebowl').controller('RunCompetitionCtrl', function (questions, $location) {
  console.log(questions);
  var ctrl = this;
  ctrl.questions = questions;
  $location.search('1', null)
});
