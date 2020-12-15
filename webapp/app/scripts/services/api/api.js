'use strict';

angular.module('knowledgebowl').service('$api', function ($api_category, $api_question, $api_customizablePage, $api_competition, $api_user, $api_auth) {
  return {
    category: $api_category,
    question: $api_question,
    customizablePage: $api_customizablePage,
    competition: $api_competition,
    user: $api_user,
    auth: $api_auth
  };
});
