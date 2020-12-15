'use strict';

angular.module('knowledgebowl').service('$api_question', function ($http) {
  return {
    list: function (params) {
      return $http({
        url: '/api/question/list',
        method: 'GET',
        params: params
      });
    },
    listByIds: function (idList) {
      return $http.get('/api/question/list-by-ids/' + idList)
    },
    getCategorizedList: function () {
      return $http.get('/api/question/list?categorize=true');
    },
    create: function (question) {
      return $http.put('/api/question', question);
    },
    edit: function (question) {
      return $http.post('/api/question', question);
    },
    deleteQuestion: function (id) {
      return $http.delete('/api/question/' + id)
    }
  };
});
