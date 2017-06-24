(function() {
  'use strict';

  angular.module('app').config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
      url: '/',
      component: 'home',
    });
    $stateProvider.state('chart1',{
      url: '/chart1',
      component: 'nlsnMarimekkoChart',
    });

    $urlRouterProvider.otherwise('/');
  }

})();
