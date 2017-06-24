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

        /*var color   = d3.scale.category10(),
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
            .attr('fill', function(d, i) { return color(i); });*/

            var width = 960,
    height = 500,
    margin = 20;

var x = d3.scale.linear()
    .range([0, width - 3 * margin]);

var y = d3.scale.linear()
    .range([0, height - 2 * margin]);

var z = d3.scale.category10();

var n = d3.format(",d"),
    p = d3.format("%");


var data = [
{"market": "Auburn, AL", "segment": "Almond lovers", "value": 3840},
{"market": "Auburn, AL", "segment": "Berry buyers", "value": 1920},
{"market": "Auburn, AL", "segment": "Carrots-n-more", "value": 960},
{"market": "Auburn, AL", "segment": "Delicious-n-new", "value": 400},
{"market": "Birmingham, AL", "segment": "Almond lovers", "value": 1600},
{"market": "Birmingham, AL", "segment": "Berry buyers", "value": 1440},
{"market": "Birmingham, AL", "segment": "Carrots-n-more", "value": 960},
{"market": "Birmingham, AL", "segment": "Delicious-n-new", "value": 400},
{"market": "Gainesville, FL", "segment": "Almond lovers", "value": 640},
{"market": "Gainesville, FL", "segment": "Berry buyers", "value": 960},
{"market": "Gainesville, FL", "segment": "Carrots-n-more", "value": 640},
{"market": "Gainesville, FL", "segment": "Delicious-n-new", "value": 400},
{"market": "Durham, NC", "segment": "Almond lovers", "value": 320},
{"market": "Durham, NC", "segment": "Berry buyers", "value": 480},
{"market": "Durham, NC", "segment": "Carrots-n-more", "value": 640},
{"market": "Durham, NC", "segment": "Delicious-n-new", "value": 400}
]

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + 2 * margin + "," + margin + ")");

  var offset = 0;

  // Nest values by segment. We assume each segment+market is unique.
  var segments = d3.nest()
      .key(function(d) { return d.segment; })
      .entries(data);

  // Compute the total sum, the per-segment sum, and the per-market offset.
  // You can use reduce rather than reduceRight to reverse the ordering.
  // We also record a reference to the parent segment for each market.
  var sum = segments.reduce(function(v, p) {
    return (p.offset = v) + (p.sum = p.values.reduceRight(function(v, d) {
      d.parent = p;
      return (d.offset = v) + d.value;
    }, 0));
  }, 0);

  // Add x-axis ticks.
  var xtick = svg.selectAll(".x")
      .data(x.ticks(10))
    .enter().append("g")
      .attr("class", "x")
      .attr("transform", function(d) { return "translate(" + x(d) + "," + y(1) + ")"; });

  xtick.append("line")
      .attr("y2", 6)
      .style("stroke", "#000");

  xtick.append("text")
      .attr("y", 8)
      .attr("text-anchor", "middle")
      .attr("dy", ".71em")
      .text(p);

  // Add y-axis ticks.
  var ytick = svg.selectAll(".y")
      .data(y.ticks(10))
    .enter().append("g")
      .attr("class", "y")
      .attr("transform", function(d) { return "translate(0," + y(1 - d) + ")"; });

  ytick.append("line")
      .attr("x1", -6)
      .style("stroke", "#000");

  ytick.append("text")
      .attr("x", -8)
      .attr("text-anchor", "end")
      .attr("dy", ".35em")
      .text(p);

  // Add a group for each segment.
  var segments = svg.selectAll(".segment")
      .data(segments)
    .enter().append("g")
      .attr("class", "segment")
      .attr("xlink:title", function(d) { return d.key; })
      .attr("transform", function(d) { return "translate(" + x(d.offset / sum) + ")"; });

  // Add a rect for each market.
  var markets = segments.selectAll(".market")
      .data(function(d) { return d.values; })
    .enter().append("a")
      .attr("class", "market")
      .attr("xlink:title", function(d) { return d.market + " " + d.parent.key + ": " + n(d.value); })
    .append("rect")
      .attr("y", function(d) { return y(d.offset / d.parent.sum); })
      .attr("height", function(d) { return y(d.value / d.parent.sum); })
      .attr("width", function(d) { return x(d.parent.sum / sum); })
      .style("fill", function(d) { return z(d.market); });

      });
    }
  }

})();