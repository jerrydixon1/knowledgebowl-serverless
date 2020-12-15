'use strict';

/**
 * @ngdoc function
 * @name knowledgebowl.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Login Controller of the knowledgebowl
 */
angular.module('knowledgebowl').controller('LoginCtrl', function (AuthenticationService, $location, toastr, $rootScope) {

  this.login = function (e) {
    e.preventDefault();
    if(this.loginForm.$valid) {
      AuthenticationService.login(this.username, this.password).then(function (response) {
        toastr.success('Successfully logged in!');
        if(response && response.data && response.data.success) {
          if(response.data.user.role === 'ADMIN') {
            $rootScope.isAdmin = true;
            $location.path('/admin');
          }
          else {
            $location.path('/');
          }
        }
      }).catch(function () {
        toastr.error('Login Unsuccessful. Please try again.');
      });
    }
  }

});
