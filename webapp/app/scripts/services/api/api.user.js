'use strict';

angular.module('knowledgebowl').service('$api_user', function ($http) {
  return {
    list: function () {
      return $http.get('/api/user/list');
    },
    listByName: function (data) {
      return $http.post('/api/user/getAllByName', data);
    },
    toggleActive: function (user, opts) {
      return $http.post('/api/user/toggle-active', { data: user }, opts);
    },
    edit: function (userData) {
      return $http.post('/api/user/edit', userData);
    },
    deleteUser: function (userId) {
      return $http.delete('/api/user/' + userId);
    }
  };
});
