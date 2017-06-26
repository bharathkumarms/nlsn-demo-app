(function () {
  'use strict';
  angular
    .module('app')
    .factory('d3Factory', d3Factory);

  function d3Factory($document, $q, $rootScope, $window) {
    var deferred = $q.defer();

    var scriptTag = $document[0].createElement('script');

    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = onReadyStateChange;
    scriptTag.onload = onScriptLoad;

    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);

    return {
      d3: function () { return deferred.promise; }
    };

    function onScriptLoad() {
      $rootScope.$apply(function () { deferred.resolve($window.d3); })
    }
    function onReadyStateChange() {
      if (this.readyState == 'complete') {
        onScriptLoad();
      }
    }
  }
})();


(function () {
  'use strict';

  angular.module('app').component('nlsnBoxplotChart', {
    controller: BoxplotController,
    controllerAs: 'vm',
    templateUrl: 'app/boxplot/boxplot.view.html',
    bindings: {
      data: '=',
      name: '=',
      w: '=',
      h: '=',
      m: '=',
      color: '='
    }
  });

  /** @ngInject */
  function BoxplotController($log, SAMPLE_CONSTANT, d3Factory, $element) {
    var $ctrl = this;
    $ctrl.createChart = createChart;

    this.$onInit = function () {
      createChart($ctrl.data, $ctrl.name, $ctrl.w, $ctrl.h, $ctrl.m, $ctrl.color);
    }

    function createChart(jsonData, name, w, h, m, color) {
      d3Factory.d3().then(function (d3) {
        console.log("Start");
      });
    }
  }

})();