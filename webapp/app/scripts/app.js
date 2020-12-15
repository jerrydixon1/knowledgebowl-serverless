'use strict';

// Useful app functions
function isAdmin(AuthenticationService) {
  return AuthenticationService.isAdmin();
}

function getCategories ($http, $q, $api) {
  var deferred = $q.defer();
  $api.category.list().then(function (response) {
    deferred.resolve(response.data);
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

function welcomeHtml ($api, $q) {
  var deferred = $q.defer();
  $api.customizablePage.get('welcome-page.html').then(function (response) {
    deferred.resolve(response.data);
  }).catch(function (error) {
    deferred.reject(error);
  });
  return deferred.promise;
}

/**
 * @ngdoc overview
 * @name knowledgebowl
 * @description
 * # knowledgebowl
 *
 * Main module of the application.
 */
angular
  .module('knowledgebowl', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngStorage',
    'ngTouch',
    'ngMessages',
    'mgcrea.ngStrap',
    'angular-loading-bar',
    'toastr',
    'ui.toggle',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
    'btorfs.multiselect',
    'textAngular',
    'rzModule',
    'tableSort'
  ])
  .config(function ($routeProvider, $locationProvider, toastrConfig) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'ctrl',
        resolve: {
          welcomeHtml: welcomeHtml
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'ctrl'
      })
      .when('/forgot-password', {
        templateUrl: 'views/forgot-password.html',
        controller: 'ForgotPasswordCtrl',
        controllerAs: 'ctrl'
      })
      .when('/forgot-email', {
        templateUrl: 'views/forgot-email.html',
        controller: 'ForgotEmailCtrl',
        controllerAs: 'ctrl'
      })
      .when('/print-competition', {
        templateUrl: 'views/print-competition.html',
        controller: 'PrintCompetitionCtrl',
        controllerAs: 'ctrl',
        resolve: {
          questions: function ($location, $api, $q) {
            var deferred = $q.defer();
            var idList = $location.search().idList;
            $api.question.listByIds(idList).then(function (response) {
              deferred.resolve(response.data.questions);
            }).catch(function () {
              deferred.resolve(undefined);
            });
            return deferred.promise;
          }
        }
      })
      .when('/reset-password/:passwordResetToken', {
        templateUrl: 'views/reset-password.html',
        controller: 'ResetPasswordCtrl',
        controllerAs: 'ctrl',
        resolve: {
          authorizedToken: function ($route, $api, $q) {
            var deferred = $q.defer();
            $api.auth.authorizePasswordResetToken($route.current.params.passwordResetToken).then(function (response) {
              deferred.resolve(response.data.token);
            }).catch(function () {
              deferred.resolve(undefined);
            });
            return deferred.promise;
          }
        }
      })
      .when('/competition/run', {
        templateUrl: 'views/run-competition.html',
        controller: 'RunCompetitionCtrl',
        controllerAs: 'ctrl',
        resolve: {
          questions: function ($api, $q) {
            var deferred = $q.defer();
            $api.competition.generateQuestions().then(function (response) {
              deferred.resolve(response.data);
            }).catch(function (err) {
              deferred.reject(err);
            });
            return deferred.promise;
          }
        }
      })
      .when('/practice', {
        templateUrl: 'views/practice.html',
        controller: 'PracticeCtrl',
        controllerAs: 'ctrl',
        resolve: {
          questions: function ($api) {
            return $api.question.getCategorizedList();
          }
        }
      })
      .when('/manage-users', {
        templateUrl: 'views/manage-users.html',
        controller: 'ManageUsersCtrl',
        controllerAs: 'ctrl',
        resolve: {
          users: function ($api, $q) {
            var deferred = $q.defer();
            $api.user.list().then(function (response) {
              deferred.resolve(response.data);
            }).catch(function (err) {
              deferred.reject(err);
            });
            return deferred.promise;
          },
          isAdmin: isAdmin
        }
      })
      .when('/manage-questions', {
        templateUrl: 'views/manage-questions.html',
        controller: 'ManageQuestionsCtrl',
        controllerAs: 'ctrl',
        resolve: {
          questions: function ($api) {
            return $api.question.list({page: 1});
          },
          categories: getCategories
        }
      })
      .when('/manage-welcome-page', {
        templateUrl: 'views/manage-welcome-page.html',
        controller: 'ManageWelcomePageCtrl',
        controllerAs: 'ctrl',
        resolve: {
          welcomeHtml: welcomeHtml
        }
      })
      .otherwise({
        redirectTo: '/'
      });

    // Remove # tags in urls
    $locationProvider.html5Mode(true);

    // Toastr config
    angular.extend(toastrConfig, {
      extendedTimeOut: 1000,
      timeOut: 6000,
      toastClass: 'toast'
    });
  })
  .run(function ($rootScope, $http, $location, $localStorage, $api) {

    $rootScope.runningCompetition = false;
    
    // keep user logged in after page refresh
    if ($localStorage.currentUser) {
      $http.defaults.headers.common.Authorization = $localStorage.currentUser.token;
      $api.auth.getCurrentUser().then(function (response) {
        if(response.data.role === 'ADMIN') {
          $rootScope.isAdmin = true;
        }
      });
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function () {
      if($localStorage.currentUser) {
        $rootScope.user = $localStorage.currentUser;
      }
      var publicPages = ['/login', '/forgot-password', '/forgot-email', '/reset-password'];
      var restrictedPage = true;
      _.each(publicPages, function(publicPage) {
        if($location.path().indexOf(publicPage) !== -1) {
          restrictedPage = false;
        }
      });
      if (restrictedPage && !$localStorage.currentUser) {
        $location.path('/login');
      }
    });
  })
  .controller('NavCtrl', function (AuthenticationService) {
    this.logout = AuthenticationService.logout;
  })
  .constant('_', window._);
