(function() {
  'use strict';

  angular.module('app').component('nlsnMarimekkoChart', {
    controller: MarimekkoController,
    controllerAs: 'vm',
    templateUrl: 'app/marimekko/marimekko.view.html',
  });

  /** @ngInject */
  function MarimekkoController($log, SAMPLE_CONSTANT) {
    //var vm = this;
    alert("assssssaaa");
    $log.debug('home activation');
  }

})();
