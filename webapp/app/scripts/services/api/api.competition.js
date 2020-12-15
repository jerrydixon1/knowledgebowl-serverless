'use strict';

angular.module('knowledgebowl').service('$api_competition', function ($http) {
  return {
    generateQuestions: function (settings) {
      var data = settings ? {settings: settings} : undefined;
      return $http.post('/api/competition/questions', data);
    }
  };
});
