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

    angular.module('app').component('nlsnPieChart', {
        controller: PieController,
        controllerAs: 'vm',
        templateUrl: 'app/pie/pie.view.html',
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
    function PieController($log, SAMPLE_CONSTANT, d3Factory, $element) {
        var $ctrl = this;
        $ctrl.createChart = createChart;

        this.$onInit = function () {
            createChart($ctrl.data, $ctrl.name, $ctrl.w, $ctrl.h, $ctrl.m, $ctrl.color);
        }

        function createChart(jsonData, name, w, h, m, color) {
            d3Factory.d3().then(function (d3) {
                var w = 960,                        //width
                    h = 600,                            //height
                    r = 300,                            //radius
                    color = d3.scale.category20c();     //builtin range of colors
                var data = [{ "label": "Allbright", "value": 25 },
                { "label": "Arc", "value": 50 },
                { "label": "Breaker", "value": 30 },
                { "label": "Coors", "value": 40 },
                { "label": "Hancock's", "value": 60 },
                { "label": "Lamot", "value": 80 },
                { "label": "Toby", "value": 15 }];

                var vis = d3.select($element[0]).append('svg')              //create the SVG element inside the <body>
                    .data([data])                   //associate our data with the document
                    .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                    .attr("height", h)
                    .append("svg:g")                //make a group to hold our pie chart
                    .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
                var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
                    .outerRadius(r);
                var pie = d3.layout.pie()           //this will create arc data for us given a list of values
                    .value(function (d) { return d.value; });    //we must tell it out to access the value of each element in our data array
                var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                    .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
                    .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                    .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                    .attr("class", "slice");    //allow us to style things in the slices (like text)
                arcs.append("svg:path")
                    .attr("fill", function (d, i) { return color(i); }) //set the color for each slice to be chosen from the color function defined above
                    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
                arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function (d) {                    //set the label's origin to the center of the arc
                        //we have to make sure to set these before calling arc.centroid
                        d.innerRadius = 0;
                        d.outerRadius = r;
                        return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
                    })
                    .attr("text-anchor", "middle")                          //center the text on it's origin
                    .text(function (d, i) { return data[i].label; });        //get the label from our original data array

            });
        }
    }

})();