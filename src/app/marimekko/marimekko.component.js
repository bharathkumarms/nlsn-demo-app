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

  angular.module('app').component('nlsnMarimekkoChart', {
    controller: MarimekkoController,
    controllerAs: 'vm',
    templateUrl: 'app/marimekko/marimekko.view.html',
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
  function MarimekkoController($log, SAMPLE_CONSTANT, d3Factory, $element) {
    var $ctrl = this;
    $ctrl.createChart = createChart;

    this.$onInit = function () {
      createChart($ctrl.data, $ctrl.name, $ctrl.w, $ctrl.h, $ctrl.m, $ctrl.color);
    }

    function createChart(jsonData, name, w, h, m, color) {
      d3Factory.d3().then(function (d3) {
        var width = 960,
          height = 500,
          margin = 50;

        var x = d3.scale.linear()
          .range([0, width - 3 * margin]);

        var y = d3.scale.linear()
          .range([0, height - 2 * margin]);

        var z = d3.scale.category10();

        var n = d3.format(",d"),
          p = d3.format("%");

        var svg = d3.select($element[0]).append('svg')
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + 2 * margin + "," + margin + ")")
          .attr("class", function (d) { return "nlsn-marimimekko-g" });

        svg.append("text")
          .attr("dx", function (d) { return 50 })
          .attr("dy", function (d) { return -20 })
          .text(function (d) { return "Contribution to Overall Sales by Product & Country (in US $)" })
          .attr("class", function (d) { return "nlsn-marimimekko-header" });

        svg.append("text")
          .attr("dx", function (d) { return 300 })
          .attr("dy", function (d) { return -5 })
          .text(function (d) { return "Previous financial year" })
          .attr("class", function (d) { return "nlsn-marimimekko-xlabel" });

        if (jsonData == undefined) {
          var data = [
            { "market": "India", "segment": "Product A", "value": 3840 },
            { "market": "India", "segment": "Product B", "value": 1920 },
            { "market": "India", "segment": "Product C", "value": 960 },
            { "market": "India", "segment": "Product D", "value": 400 },
            { "market": "China", "segment": "Product A", "value": 1600 },
            { "market": "China", "segment": "Product B", "value": 1440 },
            { "market": "China", "segment": "Product C", "value": 960 },
            { "market": "China", "segment": "Product D", "value": 400 },
            { "market": "US", "segment": "Product A", "value": 640 },
            { "market": "US", "segment": "Product B", "value": 960 },
            { "market": "US", "segment": "Product C", "value": 640 },
            { "market": "US", "segment": "Product D", "value": 400 },
            { "market": "UK", "segment": "Product A", "value": 320 },
            { "market": "UK", "segment": "Product B", "value": 480 },
            { "market": "UK", "segment": "Product C", "value": 640 },
            { "market": "UK", "segment": "Product D", "value": 400 },
            { "market": "FR", "segment": "Product A", "value": 320 },
            { "market": "FR", "segment": "Product B", "value": 480 },
            { "market": "FR", "segment": "Product C", "value": 640 },
            { "market": "FR", "segment": "Product D", "value": 400 },
            { "market": "GB", "segment": "Product A", "value": 320 },
            { "market": "GB", "segment": "Product B", "value": 480 },
            { "market": "GB", "segment": "Product C", "value": 640 },
            { "market": "GB", "segment": "Product D", "value": 400 },
            { "market": "GR", "segment": "Product A", "value": 720 },
            { "market": "GR", "segment": "Product B", "value": 680 },
            { "market": "GR", "segment": "Product C", "value": 540 },
            { "market": "GR", "segment": "Product D", "value": 400 },
            { "market": "SA", "segment": "Product A", "value": 320 },
            { "market": "SA", "segment": "Product B", "value": 280 },
            { "market": "SA", "segment": "Product C", "value": 140 },
            { "market": "SA", "segment": "Product D", "value": 900 },
            { "market": "JP", "segment": "Product A", "value": 820 },
            { "market": "JP", "segment": "Product B", "value": 780 },
            { "market": "JP", "segment": "Product C", "value": 640 },
            { "market": "JP", "segment": "Product D", "value": 500 },
            { "market": "AUS", "segment": "Product A", "value": 420 },
            { "market": "AUS", "segment": "Product B", "value": 380 },
            { "market": "AUS", "segment": "Product C", "value": 240 },
            { "market": "AUS", "segment": "Product D", "value": 100 }
          ]
        } else {
          //Do api call
        }

        var offset = 0;

        // Nest values by segment. We assume each segment+market is unique.
        var segments = d3.nest()
          .key(function (d) { return d.segment; })
          .entries(data);

        // Compute the total sum, the per-segment sum, and the per-market offset.
        // You can use reduce rather than reduceRight to reverse the ordering.
        // We also record a reference to the parent segment for each market.
        var sum = segments.reduce(function (v, p) {
          return (p.offset = v) + (p.sum = p.values.reduceRight(function (v, d) {
            d.parent = p;
            return (d.offset = v) + d.value;
          }, 0));
        }, 0);

        // Add x-axis ticks.
        var xtick = svg.selectAll(".x")
          .data(x.ticks(10))
          .enter().append("g")
          .attr("class", "x")
          .attr("transform", function (d) { return "translate(" + x(d) + "," + y(1) + ")"; });

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
          .attr("transform", function (d) { return "translate(0," + y(1 - d) + ")"; });

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
          .attr("xlink:title", function (d) { return d.key; })
          .attr("transform", function (d) { return "translate(" + x(d.offset / sum) + ")"; });

        // Add a rect for each market.
        var markets = segments.selectAll(".market")
          .data(function (d) { return d.values; })
          .enter().append("a").attr("xlink:href", function(d){ return "/pie/"+d.market})
          .attr("class", "market")
          .attr("xlink:title", function (d) { return d.market + " " + d.parent.key + ": " + n(d.value); })
          .append("rect")
          .attr("y", function (d) { return y(d.offset / d.parent.sum); })
          .attr("height", function (d) { return y(d.value / d.parent.sum); })
          .attr("width", function (d) { return x(d.parent.sum / sum); })
          .style("fill", function (d) { return z(d.market); });


        var legendData = [];
        legendData = _.uniq(_.map(data, function (o) { return o.market }));

        // add legend   
        var legend = d3.select($element[0]).select('svg').append('g')
          .attr("class", "legend")
          .attr("height", 100)
          .attr("width", 100)
          .attr('transform', 'translate(25,50)')

        var color_hash = ["blue", "orange", "green", "red", "pink", "brown", "rgb(227, 119, 194)", "grey", "rgb(188, 189, 34)", "rgb(23, 190, 207)"];

        legend.selectAll('rect')
          .data(legendData)
          .enter()
          .append("rect")
          .attr("x", width - 65)
          .attr("y", function (d, i) { return i * 20; })
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", function (d, i) {
            var color = color_hash[i];
            return color;
          })

        legend.selectAll('text')
          .data(legendData)
          .enter()
          .append("text")
          .attr("x", width - 52)
          .attr("y", function (d, i) { return i * 20 + 9; })
          .text(function (d, i) {
            var text = d;
            return text;
          });
      });
    }
  }

})();