(function () {
  'use strict';
  angular
    .module('app')
    .factory('d3Factory', d3Factory);

    function d3Factory ( $document, $q, $rootScope, $window ) {
      var deferred = $q.defer();

      var scriptTag = $document[0].createElement('script');

      scriptTag.type               = 'text/javascript';
      scriptTag.async              = true;
      scriptTag.src                = 'http://d3js.org/d3.v3.min.js';
      scriptTag.onreadystatechange = onReadyStateChange;
      scriptTag.onload             = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      return {
        d3: function() {return deferred.promise; }
      };

      function onScriptLoad () {
        $rootScope.$apply(function () { deferred.resolve($window.d3); })
      }
      function onReadyStateChange () {
        if (this.readyState == 'complete') {
          onScriptLoad();
        }
      }
    }
})();


(function() {
  'use strict';

  angular.module('app').component('nlsnMarimekkoChart', {
    controller: MarimekkoController,
    controllerAs: 'vm',
    templateUrl: 'app/marimekko/marimekko.view.html',
  });

  /** @ngInject */
  function MarimekkoController($log, SAMPLE_CONSTANT,d3Factory,$element) {
    var $ctrl = this;
    $ctrl.createChart = createChart;
    createChart();
    
    function createChart() {
      d3Factory.d3().then(function(d3) {

        var color   = d3.scale.category10(),
            data    = [10, 20, 30],
            width   = 100,
            height  = 100,
            min     = Math.min(width, height),
            svg     = d3.select($element[0]).append('svg'),
            pie     = d3.layout.pie().sort(null),
            arc     = d3.svg.arc()
                        .outerRadius(min / 2 * 0.9)
                        .innerRadius(min / 2 * 0.5);

        svg.attr({width: width, height: height});
        var g = svg.append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        g.selectAll('path').data(pie(data))
          .enter().append('path')
            .style('stroke', 'white')
            .attr('d', arc)
            .attr('fill', function(d, i) { return color(i); });

      });
    }
  }

})();