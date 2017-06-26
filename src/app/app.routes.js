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
      component: 'nlsnMarimekkoChart'
    });
    $stateProvider.state('boxplot',{
      url: '/boxplot',
      component: 'nlsnBoxplotChart'
    });
    $stateProvider.state('pie',{
      url: '/pie/:param',
      component: 'nlsnPieChart'
    });

    $urlRouterProvider.otherwise('/');
  }

})();
