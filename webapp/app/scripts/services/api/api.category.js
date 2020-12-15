'use strict';

angular.module('knowledgebowl').service('$api_category', function ($http) {
  return {
    list: function () {
      return $http.get('/api/category/list');
    },
    create: function (data) {
      return $http.put('/api/category', data);
    },
    edit: function (data) {
      return $http.post('/api/category', data);
    },
    remove: function (id) {
      return $http.delete('/api/category/' + id)
    }
  };
});
