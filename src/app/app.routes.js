(function() {
  'use strict';

  angular.module('app').config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
      url: '/',
      component: 'home',
    });
    $stateProvider.state('marimekko',{
      url: '/marimekko',
      component: 'nlsnMarimekkoChart',
    });

    $urlRouterProvider.otherwise('/');
  }

})();
