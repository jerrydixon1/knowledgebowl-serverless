'use strict';

angular.module('knowledgebowl').service('$api_customizablePage', function ($http) {
  return {
    get: function (pageName) {
      return $http.get('/api/customizable-page/' + pageName);
    },
    edit: function (pageName, html) {
      return $http.post('/api/customizable-page/' + pageName, {
        html: html
      });
    }
  };
});
