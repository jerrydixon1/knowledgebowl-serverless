'use strict';

angular.module('knowledgebowl').directive('adminNav', function ($dropdown, $compile) {
  return {
    scope: true,
    template:
      '<div style="display: inline-block" id="admin-dropdown-nav">' +
        '<a href="" bs-dropdown aria-haspopup="true" aria-expanded="false" data-trigger="click">Admin</a>' +
        '<ul class="dropdown-menu" role="menu">' +
          '<li><a href="#anotherAction"><i class="fa fa-download"></i>&nbsp;Some action</a></li>' +
        '</ul>' +
      '</div>',
    replace: true,
    terminal: true,
    priority: 1,
    link: function (scope, element, attrs) {
      angular.element(document).on('click', function(e) {
        e.preventDefault();
      });
      $compile(element)(scope);
    }
  };
});
