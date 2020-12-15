(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name knowledgebowl.service:AuthenticationService
   * @description
   * # AuthenticationService
   * Authentication service for the app
   */
  angular.module('knowledgebowl').service('AuthenticationService', function ($api, $http, $localStorage, $q, $rootScope, $location) {
    return {
      login: function (username, password, callback) {
        var self = this;
        var deferred = $q.defer();
        $api.auth.login(username, password).then(function (response) {
          // login successful if there's a token in the response
          if (response.data.success && response.data.token) {
            // store username and token in local storage to keep user logged in between page refreshes
            $localStorage.currentUser = {username: username, token: response.data.token};

            // add jwt token to auth header for all requests made by the $http service
            $http.defaults.headers.common.Authorization = response.data.token;

            // Check if users is an admin
            self.isAdmin().then(function () {
              // is an admin
              $rootScope.isAdmin = true;
              deferred.resolve(response);
            }).catch(function () {
              // Not an admin
              deferred.resolve(response);
            });
          } else {
            // execute callback with false to indicate failed login
            deferred.resolve(undefined);
          }
        }).catch(function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      logout: function () {
        // remove user from local storage and clear http auth header
        delete $localStorage.currentUser;
        $rootScope.user = undefined;
        $http.defaults.headers.common.Authorization = '';
        $location.path('/login');
      },
      isAdmin: function () {
        var deferred = $q.defer();
        $api.auth.getCurrentUser().then(function (response) {
          var user = response.data;
          if(user.role !== 'ADMIN') {
            deferred.reject();
            $location.path('/?error=not-admin');
          }
          else {
            $rootScope.isAdmin = true;
            deferred.resolve();
          }
        }).catch(function () {
          deferred.reject();
          $location.path('/?error=unknown-error');
        });
        return deferred.promise;
      }
    };
  });

})();
