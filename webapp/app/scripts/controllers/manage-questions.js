'use strict';

angular.module('knowledgebowl').controller('ManageQuestionsCtrl', function ($rootScope, $http, $api, $timeout, questions, categories) {

  var ctrl = this;

  ctrl.pagination = {};
  ctrl.filters = {
    question: '',
    answer: '',
    category_id: ''
  };

  ctrl.questions = questions.data.questions;
  ctrl.pagination.questions = questions.data.pagination;

  ctrl.categories = categories;

  var searching;
  $rootScope.$on('question_list_reload', function (event, pageNumber) {
    if(searching) {
      $timeout.cancel(searching);
    }

    searching = $timeout(function () {
      if(!pageNumber) {
        pageNumber = ctrl.pagination.page;
      }
      $api.question.list({
        page: pageNumber,
        filters: ctrl.filters,
        search: ctrl.search
      }).then(function (response) {
        ctrl.questions = response.data.questions;
        ctrl.pagination.questions = response.data.pagination;
      });
    }, 350);
  });

  $rootScope.$on('category_list_reload', function () {
    $api.category.list().then(function (response) {
      ctrl.categories = response.data;
    });
  });

  ctrl.questionsPageChanged = function (pageNumber) {
    $rootScope.$emit('question_list_reload', pageNumber);
  };

  ctrl.doSearch = function () {
    $rootScope.$emit('question_list_reload');
  };

});
