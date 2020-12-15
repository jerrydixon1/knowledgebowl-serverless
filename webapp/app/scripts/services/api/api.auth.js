'use strict';

angular.module('knowledgebowl').service('$api_auth', function ($http) {
  return {
    authorizePasswordResetToken:  function (token) {
      return $http.get('/api/auth/password-reset-token/authorize/' + token);
    },
    getCurrentUser: function () {
      return $http.get('/api/auth/current-user');
    },
    sendForgotPasswordEmail: function (username) {
      return $http.post('/api/auth/forgot-password', { username: username });
    },
    registerNewUser: function (userData) {
      return $http.post('/api/auth/register', userData);
    },
    resendCreationEmail: function (userId) {
      return $http.post('/api/auth/resend-creation-email', {id: userId});
    },
    resetPassword: function (data) {
      return $http.post('/api/auth/reset-password', data);
    },
    login: function (username, password) {
      return $http.post('/api/auth/login', {
        username: username,
        password: password
      });
    }
  };
});
