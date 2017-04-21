let center = { x: window.innerWidth / 2, y: window.innerHeight / 2};
let colors = {
  "e": "#00FFCA",
  "a": "#FF3054",
  "d": "#EEFF14"
};

let faculties = [
  "a",
  "e",
  "d"
];

let architecture = [
  "architettura",
  "architettura - architettura delle costruzioni",
  "architettura - progettazione architettonica",
  "gestione del costruito",
  "pianificazione urbana e politiche territoriali",
  "pianificazione territoriale urbanistica e ambientale"
];

let design = [
  "design & engineering",
  "design degli interni (interior design)",
  "design del prodotto per l'innovazione",
  "design del sistema prodotto (product service system design)",
  "design dell'arredo (furniture design)",
  "design della comunicazione",
  "design della comunicazione (communication design)",
  "design della moda (fashion design)",
  "design per il sistema moda",
  "disegno industriale",
  "disegno industriale (industrial design)",
  "interior design",
  "progetto e ingegnerizzazione del prodotto industriale (design & engineering)",
  "product service system design"
];

let engineering = [
  "ingegneria meccanica",
  "ingegneria chimica",
  "ingegneria aeronautica",
  "biomedical engineering - ingegneria biomedica",
  "civil engineering for risk mitigation",
  "computer science and engineering - ingegneria informatica",
  "environmental and geomatic engineering",
  "ingegneria aeronautica",
  "ingegneria aerospaziale",
  "ingegneria biomedica",
  "ingegneria chimica",
  "ingegneria civile",
  "ingegneria civile - civil engineering",
  "ingegneria dei materiali",
  "ingegneria dei sistemi edilizi",
  "ingegneria dell'automazione",
  "ingegneria della prevenzione e della sicurezza nell'industria di processo",
  "ingegneria delle telecomunicazioni",
  "ingegneria edile",
  "ingegneria edile - architettura",
  "ingegneria elettrica",
  "ingegneria elettronica",
  "ingegneria energetica",
  "ingegneria fisica",
  "ingegneria gestionale",
  "ingegneria informatica",
  "ingegneria matematica",
  "ingegneria nucleare",
  "ingegneria per l'ambiente e il territorio",
  "ingegneria per l'ambiente e il territorio - environmental and land planning engineering",
  "ingegneria spaziale",
  "management engineering - ingegneria gestionale",
  "materials engineering and nanotechnology",
  "materials engineering and nanotechnology - ingegneria dei materiali e delle nanotecnologie",
  "mechanical engineering - ingegneria meccanica",
  "telecommunication engineering - ingegneria delle telecomunicazioni"
];

let facultyNodes = {};
let keywords = [];
let radius = (window.innerWidth / 2) * .4;
let size = null;
let total = 0;

var currentPage = 0;
var limitter = 1;

var minimumYear = 2008;
var maximumYear = 2016;

// Fetch data
// 54325 keywords
firebase.database().ref('/keywords').orderByChild('total').startAt(5).once('value', snapshot => {
  snapshot.forEach(keyword => {
    var word = keyword.val();
    var final = { a: 0, d: 0, e: 0};

    architecture.forEach(course => {
      if (Object.keys(word).includes(course))
        final.a += word[course];
    });

    design.forEach(course => {
      if (Object.keys(word).includes(course))
        final.d += word[course];
    });

    engineering.forEach(course => {
      if (Object.keys(word).includes(course))
        final.e += word[course];
    });

    final.keyword = keyword.key;
    final.total = word.total;
    keywords.push(final);
    total += final.total;
  });
}).then(v => {
  /* TEST */

  // var timeLineData = [
  //   { year: 2008, total: 100 },
  //   { year: 2009, total: 200 },
  //   { year: 2010, total: 400 },
  //   { year: 2011, total: 200 },
  //   { year: 2012, total: 300 },
  //   { year: 2013, total: 200 },
  //   { year: 2014, total: 100 },
  //   { year: 2015, total: 400 },
  //   { year: 2016, total: 100 }
  // ];
  //
  //
  // var flights = timeLineData;
  // // Various formatters.
  // const formatNumber = d3.format(',d');
  //
  // // A nest operator, for grouping the flight list.
  // const nestByDate = d3.nest()
  //   .key(d => d3.timeDay(d.date));
  //
  // // A little coercion, since the CSV is untyped.
  // flights.forEach((d, i) => {
  //   d.index = i;
  //   d.year = d.year;
  //   d.total = d.total;
  // });
  //
  // // Create the crossfilter for the relevant dimensions and groups.
  // const flight = crossfilter(flights);
  //
  // const all = flight.groupAll();
  // const year = flight.dimension(d => Math.min(1999, d.year));
  // const years = year.group(d => Math.floor(d / 50) * 50);
  //
  // console.log(year);
  // console.log(years);
  //
  // const charts = [
  //   barChart()
  //    .dimension(year)
  //    .group(years)
  //    .x(d3.scaleLinear()
  //      .domain([2008, 2016])
  //      .rangeRound([0, 10 * 40])),
  //
  //       // TODO: Choose an approriate filter
  //       // TODO: Animate this using a transition
  // ];
  //
  // // Given our array of charts, which we assume are in the same order as the
  // // .chart elements in the DOM, bind the charts to the DOM and render them.
  // // We also listen to the chart's brush events to update the display.
  // const chart = d3.selectAll('.chart')
  //   .data(charts);
  //
  // // Render the initial lists.
  // const list = d3.selectAll('.list')
  //   .data([flightList]);
  //
  // // Render the total.
  // d3.selectAll('#total')
  //   .text(formatNumber(flight.size()));
  //
  // renderAll();
  //
  // // Renders the specified chart or list.
  // function render(method) {
  //   d3.select(this).call(method);
  // }
  //
  // // Whenever the brush moves, re-rendering everything.
  // function renderAll() {
  //   chart.each(render);
  //   list.each(render);
  //   d3.select('#active').text(formatNumber(all.value()));
  // }
  //
  // window.filter = filters => {
  //   filters.forEach((d, i) => { charts[i].filter(d); });
  //   renderAll();
  // };
  //
  // window.reset = i => {
  //   charts[i].filter(null);
  //   renderAll();
  // };
  //
  // function flightList(div) {
  //   const flightsByDate = nestByDate.entries(date.top(40));
  //
  //   div.each(function () {
  //     const date = d3.select(this).selectAll('.date')
  //       .data(flightsByDate, d => d.key);
  //
  //     date.exit().remove();
  //
  //     date.enter().append('div')
  //       .attr('class', 'date')
  //       .append('div')
  //         .attr('class', 'day')
  //         .text(d => formatDate(d.values[0].date))
  //       .merge(date);
  //
  //     const flight = date.order().selectAll('.flight')
  //       .data(d => d.values, d => d.index);
  //
  //     flight.exit().remove();
  //
  //     const flightEnter = flight.enter().append('div')
  //       .attr('class', 'flight');
  //
  //     flightEnter.append('div')
  //       .attr('class', 'time')
  //       .text(d => formatTime(d.date));
  //
  //     flightEnter.append('div')
  //       .attr('class', 'origin')
  //       .text(d => d.origin);
  //
  //     flightEnter.append('div')
  //       .attr('class', 'destination')
  //       .text(d => d.destination);
  //
  //     flightEnter.append('div')
  //       .attr('class', 'distance')
  //       .text(d => `${formatNumber(d.distance)} mi.`);
  //
  //     flightEnter.append('div')
  //       .attr('class', 'delay')
  //       .classed('early', d => d.delay < 0)
  //       .text(d => `${formatChange(d.delay)} min.`);
  //
  //     flightEnter.merge(flight);
  //
  //     flight.order();
  //   });
  // }

  /*
  function barChart() {
    if (!barChart.id) barChart.id = 0;

    let margin = { top: 10, right: 13, bottom: 20, left: 10 };
    let x;
    let y = d3.scaleLinear().range([100, 0]);
    const id = barChart.id++;
    const axis = d3.axisBottom();
    const brush = d3.brushX();
    let brushDirty;
    let dimension;
    let group;
    let round;
    let gBrush;

    function chart(div) {
      const width = x.range()[1];
      const height = y.range()[0];

      brush.extent([[0, 0], [width, height]]);

      y.domain([0, group.top(1)[0].value]);

      div.each(function () {
        const div = d3.select(this);
        let g = div.select('g');

        // Create the skeletal chart.
        if (g.empty()) {
          div.select('.title').append('a')
            .attr('href', `javascript:reset(${id})`)
            .attr('class', 'reset')
            .text('reset')
            .style('display', 'none');

          g = div.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);

          g.append('clipPath')
            .attr('id', `clip-${id}`)
            .append('rect')
              .attr('width', width)
              .attr('height', height);

          g.selectAll('.bar')
            .data(['background', 'foreground'])
            .enter().append('path')
              .attr('class', d => `${d} bar`)
              .datum(group.all());

          g.selectAll('.foreground.bar')
            .attr('clip-path', `url(#clip-${id})`);

          g.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${height})`)
            .call(axis);

          // Initialize the brush component with pretty resize handles.
          gBrush = g.append('g')
            .attr('class', 'brush')
            .call(brush);

          gBrush.selectAll('.handle--custom')
            .data([{ type: 'w' }, { type: 'e' }])
            .enter().append('path')
              .attr('class', 'brush-handle')
              .attr('cursor', 'ew-resize')
              .attr('d', resizePath)
              .style('display', 'none');
        }

        // Only redraw the brush if set externally.
        if (brushDirty !== false) {
          const filterVal = brushDirty;
          brushDirty = false;

          div.select('.title a').style('display', d3.brushSelection(div) ? null : 'none');

          if (!filterVal) {
            g.call(brush);

            g.selectAll(`#clip-${id} rect`)
              .attr('x', 0)
              .attr('width', width);

            g.selectAll('.brush-handle').style('display', 'none');
            renderAll();
          } else {
            const range = filterVal.map(x);
            brush.move(gBrush, range);
          }
        }

        g.selectAll('.bar').attr('d', barPath);
      });

      function barPath(groups) {
        const path = [];
        let i = -1;
        const n = groups.length;
        let d;
        while (++i < n) {
          d = groups[i];
          path.push('M', x(d.key), ',', height, 'V', y(d.value), 'h9V', height);
        }
        return path.join('');
      }

      function resizePath(d) {
        const e = +(d.type === 'e');
        const x = e ? 1 : -1;
        const y = height / 3;
        return `M${0.5 * x},${y}A6,6 0 0 ${e} ${6.5 * x},${y + 6}V${2 * y - 6}A6,6 0 0 ${e} ${0.5 * x},${2 * y}ZM${2.5 * x},${y + 8}V${2 * y - 8}M${4.5 * x},${y + 8}V${2 * y - 8}`;
      }
    }

    brush.on('start.chart', function () {
      const div = d3.select(this.parentNode.parentNode.parentNode);
      div.select('.title a').style('display', null);
    });

    brush.on('brush.chart', function () {
      const g = d3.select(this.parentNode);
      const brushRange = d3.event.selection || d3.brushSelection(this); // attempt to read brush range
      const xRange = x && x.range(); // attempt to read range from x scale
      let activeRange = brushRange || xRange; // default to x range if no brush range available

      const hasRange = activeRange &&
        activeRange.length === 2 &&
        !isNaN(activeRange[0]) &&
        !isNaN(activeRange[1]);

      if (!hasRange) return; // quit early if we don't have a valid range

      // calculate current brush extents using x scale
      let extents = activeRange.map(x.invert);

      // if rounding fn supplied, then snap to rounded extents
      // and move brush rect to reflect rounded range bounds if it was set by user interaction
      if (round) {
        extents = extents.map(round);
        activeRange = extents.map(x);

        if (
          d3.event.sourceEvent &&
          d3.event.sourceEvent.type === 'mousemove'
        ) {
          d3.select(this).call(brush.move, activeRange);
        }
      }

      // move brush handles to start and end of range
      g.selectAll('.brush-handle')
        .style('display', null)
        .attr('transform', (d, i) => `translate(${activeRange[i]}, 0)`);

      // resize sliding window to reflect updated range
      g.select(`#clip-${id} rect`)
        .attr('x', activeRange[0])
        .attr('width', activeRange[1] - activeRange[0]);

      // filter the active dimension to the range extents
      dimension.filterRange(extents);

      // re-render the other charts accordingly
      renderAll();
    });

    brush.on('end.chart', function () {
      // reset corresponding filter if the brush selection was cleared
      // (e.g. user "clicked off" the active range)
      if (!d3.brushSelection(this)) {
        reset(id);
      }
    });

    chart.margin = function (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function (_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function (_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = _ => {
      if (!_) dimension.filterAll();
      brushDirty = _;
      return chart;
    };

    chart.group = function (_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function (_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    chart.gBrush = () => gBrush;

    return chart;
  }
  */

  size = d3.scaleSqrt()
    .domain([0, total])
    .range([0, 96]);

  // Faculties circles
  faculties.forEach(function(faculty, index) {
    facultyNodes[faculty] = {
      x: center.x + radius * Math.cos(2 * Math.PI * (index / faculties.length)),
      y: center.y + radius * Math.sin(2 * Math.PI * (index / faculties.length))
    }
  });

  keywords.forEach(keyword => {
    let upX = 0;
    let upY = 0;
    let down = 0;
    let colorRed = 0;
    let colorGreen = 0;
    let colorBlue = 0;

    var keys = Object.keys(keyword);

    faculties.forEach(faculty => {
      // Figure out what faculties a keyword belongs to
      var multiplier = parseFloat(keyword[faculty] / keyword.total);
      upX += multiplier * facultyNodes[faculty].x;
      upY += multiplier * facultyNodes[faculty].y;
      colorRed += multiplier * d3.color(colors[faculty]).r;
      colorGreen += multiplier * d3.color(colors[faculty]).g;
      colorBlue += multiplier * d3.color(colors[faculty]).b;
      down += multiplier;
    });

    keyword.positionX = upX / down;
    keyword.positionY = upY / down;

    let color = d3.rgb(colorRed, colorGreen, colorBlue);
    let lightness = 1 / Math.sqrt(Math.pow(keyword.positionX - center.x, 2) + Math.pow(keyword.positionY - center.y, 2));
    keyword.color = color.brighter(lightness / 0.0080);
  });

  var bubbles = keywords;

  _.forEach(facultyNodes, function(value, key) {
    // Push the faculty nodes into the set of keywords (so that they can be mapped together)
    bubbles.push({
      keyword: key,
      type: "focus",
      positionX: value.x,
      positionY: value.y,
      total: 2000, // TODO To be calculated dynamically with a coefficient to scale.
      color: colors[key]
    });
  });

  var tip = d3.tip();
  var svg, g;

  function initSVG() {
    svg = d3.select(".visualisation").append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed)
      )

    g = svg.append("g")
      .attr("class", "g")
      .style("pointer-events", "all");

    g.append("rect")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .style("fill", "none");

    function zoomed() {
      g.attr("transform", d3.event.transform);
    }
  }

  navigateTo(0);

  function showHome() {
    initSVG();

    $('#title').show();
    $('#intro').show();
    $('#credits').show();
    $('#back').hide();

    // Polimi Circle
    var polimiBubble = svg.append("ellipse")
      .attr("cx", center.x)
      .attr("cy", center.y)
      .attr("rx", 0)
      .attr("ry", 0)
      .attr("fill", "#E1BEE7")
      .on("click", d => {
        $('#title').hide();
        $('#intro').hide();
        $('#credits').hide();
        $('#back').show();
        navigateTo(1);
      })
      .transition()
        .attr("rx", (total / size(total)) * 2) // TODO: modify later
        .attr("ry", (total / size(total)) * 2) // TODO: modify later
        .style("fill", "#6A1B9A");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dx", d => { return center.x; })
      .attr("dy", d => { return center.y + 9; }) // + fonts size / 2? TODO
      .attr("opacity", 0)
      .attr("font-family", "Poiret One")
      .attr("font-size", 18)
      .text(d => { return "Politecnico di Milano"; })
      .style("fill", d => { return "#E0E0E0"; })
      .transition()
        .attr("opacity", 1);

      // TODO: add a transition for the text when it's clicked as well
  }

  function showForceLayout() {
    currentPage = 1;

    initSVG();

    tip
      .attr('class', 'd3-tip')
      .attr('id', 'tooltip')
      .offset([-10, 0])
      .html(bubble => {
        if (faculties.includes(bubble.keyword)) {
          var department;
          if (bubble.keyword == 'a') department = 'Architecture';
          else if (bubble.keyword == 'd') department = 'Design';
          else if (bubble.keyword == 'e') department = 'Engineering';
          return "<strong style='color: #E0E0E0;'>Department: </strong> <span style='color:red'>" + department + "</span>";
        }
        return "<strong style='color: #E0E0E0;'>Word:</strong> <span style='color:red'>" + bubble.keyword + "</span> <br> <strong style='color: #E0E0E0;'>Architecture:</strong> <span style='color:red'>" + bubble.a + "</span> <br> <strong style='color: #E0E0E0;'>Design:</strong> <span style='color:red'>" + bubble.d + "</span> <br> <strong style='color: #E0E0E0;'>Engineering:</strong> <span style='color:red'>" + bubble.e + "</span>";
      });

    var simulation = d3.forceSimulation()
      .force("x", d3.forceX().strength(.2).x(bubble => {
        return bubble.positionX;
      }))
      .force("y", d3.forceY().strength(.2).y(bubble => {
        return bubble.positionY;
      }))
      .force("charge", d3.forceManyBody().strength(-5))
      .force("collide", d3.forceCollide().radius(bubble => {
        return size(bubble.total) + 0.5;
      }).iterations(2))
      // .force("center", d3.forceCenter(center.x, center.y));

    simulation
      .nodes(bubbles)
      .on("tick", ticked);

    var bubble = g.selectAll(".keyword")
      .data(bubbles)
      .enter()
      .append("circle")
        .attr("class", "keyword")
        .attr("r", bubble => {
          return size(bubble.total);
        })
        .style("fill", bubble => {
          return bubble.color;
        })
        .on('click', bubble => {
          navigateTo(2, bubble);
        })
        .on('mouseenter', tip.show)
        .on('mouseleave', tip.hide);

    // TODO: Labels for the bubbles
    var text = g.selectAll(".keyword-text")
      .data(bubbles)
      .enter()
      .append("text")
        .attr("class", "keyword-text")
        .attr("text-anchor", d => {
          return faculties.includes(d.keyword) ? "middle" : "left";
        })
        .attr("font-family", "Poiret One")
        .attr("font-size", 15)
        .text(d => {
          if (d.keyword == 'a') return "Architecture";
          else if (d.keyword == 'd') return "Design";
          else if (d.keyword == 'e') return "Engineering";
          else if (d.total > 40) return d.keyword;
        })
        .style("fill", d => { return d.keyword == 'a' || d.keyword == 'd' || d.keyword == 'e' ? "#212121" : "#E0E0E0"; });

    function ticked() {
      bubble.attr("cx", bubble => {
        return bubble.x;
      }).attr("cy", bubble => {
        return bubble.y;
      });
      text.attr("x", text => {
        if (faculties.includes(text.keyword)) return text.x;
        return text.x + size(text.total) + 5;
      }).attr("y", text => {
        return text.y + 6;
      });
    }

    svg.call(tip);

    // Tincy rotation
    var speed = 0;
    // d3.timer(function() {
    //   svg.style("transform", "rotate(" + speed + "deg)");
    //   speed -= .0125;
    // });
  }

  function exploreKeyword(bubble) {
    var keyword = bubble.keyword;
    console.log(keyword);

    d3.select('svg').remove();
    var metadata = {};

    // Fetch firebase metadata
    firebase.database().ref('metadata/' + keyword).once('value')
      .then(snapshot => {
        // The types of nodes in the alluvial chart
        var keyword_node = [];
        var degree_type = [];
        var relator = [];
        var school = [];
        var language = [];

        snapshot.forEach(function(object, index) {
          keyword_node.push(keyword);
          degree_type.push(object.val().degree_type);
          relator.push(object.val().relator);
          school.push(object.val().school);
          language.push(object.val().language);
        });

        // Contruct the links and the nodes
        var nodes = [];
        var links = [];

        var chosenKeyword = Array.from(new Set(keyword_node));
        var uniqueDegreeTypes = Array.from(new Set(degree_type));
        var uniqueSchools = Array.from(new Set(school));
        var uniqueRelators = Array.from(new Set(relator));
        var uniqueLanguages = Array.from(new Set(language));

        var allNodes = chosenKeyword.concat(uniqueLanguages, uniqueDegreeTypes, uniqueSchools, uniqueRelators);

        var numberOfTheses = degree_type.length;

        // Each of these unique values are nodes
        for (var i = 0; i < allNodes.length; i++) {
          var node = {
            "node": i,
            "name": allNodes[i]
          };

          nodes.push(node);
        }

        var addLink = function(source, target) {
          var found = false;
          if (links.length != 0) {
            links.forEach(link => {
              if (link.source == source && link.target == target) {
                found = true; // Link already exists.
                link.value = link.value + 1;
              }
            });

            if (!found) {
              var link = {};
              link.source = source;
              link.target = target;
              link.value = 1;
              links.push(link);
            }
          } else {
            // No links present. Create first link.
            var link = {};
            link.source = source;
            link.target = target;
            link.value = 1;
            links.push(link);
          }
        }

        // Create links
        for (var thesis = 0; thesis < numberOfTheses; thesis++) {
          nodes.forEach(sourceNode => {
            nodes.forEach(targetNode => {
              // Check for a link between the source and the target nodes
              if (sourceNode.name == keyword_node[thesis] && targetNode.name == language[thesis]) {
                // A particular thesis has this link
                addLink(sourceNode.node, targetNode.node);
              }
              // Links between degree_type and school
              if (sourceNode.name == language[thesis] && targetNode.name == degree_type[thesis]) {
                // A particular thesis has this link
                addLink(sourceNode.node, targetNode.node);
              }
              if (sourceNode.name == degree_type[thesis] && targetNode.name == school[thesis]) {
                addLink(sourceNode.node, targetNode.node);
              }
              if (sourceNode.name == school[thesis] && targetNode.name == relator[thesis]) {
                addLink(sourceNode.node, targetNode.node);
              }
            });
          });
        }

        // Push the keyword
        // nodes.push({
        //   "node": 0,
        //   "name": keyword
        // });

        // Links from keyword
        // addLink(0, 1);
        // addLink(0, 2)

        var graph = {};
        graph.nodes = nodes;
        graph.links = links;

        $("#searchbar").hide();

        currentPage = 2;
        var units = "theses"; // TODO: Handle singular ["thesis", "theses"];

        // set the dimensions and margins of the graph
        var margin = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          },
          width = 0.90 * window.innerWidth - margin.left - margin.right,
          height = 0.90 * window.innerHeight - margin.top - margin.bottom;

        // format variables
        var formatNumber = d3.format(",.0f"), // zero decimal places
          format = d => {
            return formatNumber(d) + " " + units;
          },
          color = d3.scaleOrdinal(d3.schemeCategory20);

        // append the svg object to the body of the page
        var svg = d3.select(".visualisation").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // TODO: Create a bar on top to show the occurrence of the selected keyword in the schools
        var bar = d3.select(".frequency_bar").append("svg")
          .attr("id", "frequency_bar")
          .attr("width", window.innerWidth)
          .attr("height", 18);

        var architecturePercent = (bubble.a/bubble.total) * window.innerWidth;
        var designPercent = (bubble.d/bubble.total) * window.innerWidth;
        var engineeringPercent = (bubble.e/bubble.total) * window.innerWidth;

        // pallet - a 4 d 0 e 2
        if (bubble.keyword = 'pallet') {
          console.log(bubble)
          console.log(architecturePercent / window.innerWidth)
          console.log(designPercent / window.innerWidth)
          console.log(engineeringPercent / window.innerWidth)
        }

        var bars = [
          {x: 0, width: architecturePercent, color: colors.a, label: "Architecture"},
          {x: architecturePercent, width: designPercent, color: colors.d, label: "Design"},
          {x: architecturePercent + designPercent, width: engineeringPercent, color: colors.e, label: "Engineering"}
        ]

        bar.selectAll("rect")
          .data(bars)
          .enter()
          .append("rect")
            .attr("id", "frequency_bar")
            .attr("x", d => { return d.x; })
            .attr("y", 0)
            .attr("width", d => { return d.width; })
            .attr("height", 75)
            .style("fill", d => { return d.color; });

        bar.selectAll("text")
          .data(bars)
          .enter()
          .append("text")
            .attr("dx", d => { return d.x + 25; })
            .attr("dy", 15)
            .attr("opacity", 0)
            .attr("font-family", "Poiret One")
            .attr("font-size", 15)
            .text(d => { if (d.width != 0) return d.label + ": " + Math.round(d.width/window.innerWidth * 100 * 100) / 100 + "%"; })
            .style("fill", "#212121")
            .transition()
              .attr("opacity", 1);

        var legendContainer = d3.select(".alluvial_legend").append("svg")
          .attr("id", "legend")
          .attr("width", 500)
          .attr("height", 100);

        var circles = [
          { x: 30, y: 30, r: 10, color: "#00E5FF", label: "Degree Type" },
          { x: 280, y: 30, r: 10, color: "#F50057", label: "School" },
          { x: 30, y: 70, r: 10, color: "#FFC400", label: "Language" },
          { x: 280, y: 70, r: 10, color: "#76FF03", label: "Relators" }
        ];

        legendContainer.selectAll("circle")
          .data(circles)
          .enter()
          .append("circle")
            .attr("cx", d => { return d.x; })
            .attr("cy", d => { return d.y; })
            .attr("r", d => { return d.r; })
            .style("fill", d => { return d.color; });

        legendContainer.selectAll("text")
          .data(circles)
          .enter()
          .append("text")
            .attr("dx", d => { return d.x + 25; })
            .attr("dy", d => { return d.y + 5; })
            .attr("font-family", "Poiret One")
            .text(d => { return d.label; })
            .style("fill", d => { return "#E0E0E0"; });

        d3.select(".visualisation")
          .attr("align", "center");

        // Set the sankey diagram properties
        var sankey = d3.sankey()
          .nodeWidth(25)
          .nodePadding(5)
          .size([width, height]);

        var path = sankey.link();

        sankey
          .nodes(graph.nodes)
          .links(graph.links)
          .layout(32);

        // add in the links
        var link = svg.append("g").selectAll(".link")
          .data(graph.links)
          .enter().append("path")
          .attr("class", "link")
          .attr("d", path)
          .style("stroke-width", d => {
            return Math.max(1, d.dy);
          })
          .sort(function(a, b) {
            return b.dy - a.dy;
          });

        // add the link titles
        link.append("title")
          .text(d => {
            return d.source.name + " → " +
              d.target.name + "\n" + format(d.value);
          });

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
          .data(graph.nodes)
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", d => {
            return "translate(" + d.x + "," + d.y + ")";
          })
          .call(d3.drag()
            .subject(d => {
              return d;
            })
            .on("start", d => {
              this.parentNode.appendChild(this);
            })
            .on("drag", dragmove)
          );

        // add the rectangles for the nodes
        node.append("rect")
          .attr("height", d => {
            return d.dy;
          })
          .attr("width", sankey.nodeWidth())
          .style("fill", d => {
            // return d.color = color(d.name.replace(/ .*/, ""));

            if (uniqueDegreeTypes.includes(d.name)) {
              return d3.rgb('#00E5FF');
            } else if (uniqueSchools.includes(d.name)) {
              return d3.rgb('#F50057');
            } else if (uniqueLanguages.includes(d.name)) {
              return d3.rgb('#FFC400');
            } else if (uniqueRelators.includes(d.name)) {
              return d3.rgb('#76FF03');
            } else {
              return d3.rgb('#FF3D00');
            }
          })
          .style("stroke", d => {
            if (uniqueDegreeTypes.includes(d.name)) {
              return d3.rgb('#00E5FF');
            } else if (uniqueSchools.includes(d.name)) {
              return d3.rgb('#F50057');
            } else if (uniqueLanguages.includes(d.name)) {
              return d3.rgb('#FFC400');
            } else if (uniqueRelators.includes(d.name)) {
              return d3.rgb('#76FF03');
            } else {
              return d3.rgb('#FF3D00');
            }
          })
          .append("title")
          .text(d => {
            return d.name + "\n" + format(d.value);
          });

        // add in the title for the nodes
        node.append("text")
          .style("fill", '#E0E0E0')
          .attr("x", -6)
          .attr("y", d => {
            return d.dy / 2;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", "end")
          .attr("transform", null)
          .text(d => {
            return d.name;
          })
          .filter(d => {
            return d.x < width / 2;
          })
          .attr("x", 6 + sankey.nodeWidth())
          .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
          d3.select(this)
            .attr("transform",
              "translate(" +
              d.x + "," +
              (d.y = Math.max(
                0, Math.min(height - d.dy, d3.event.y))) + ")");
          sankey.relayout();
          link.attr("d", path);
        }
      })
      .catch(e => {
        console.log("Failed to fetch :( " + e);
      });
  }

  d3.select(window).on('resize', resize);

  function resize() {
    // TODO: complete this
  }

  function navigateTo(navigate, bubble) {
    switch (navigate) {
      case 0:
        currentPage = 0;
        $(".visualisation").css({ position: 'absolute' });
        $('#searchbar').hide();
        $('#alluvial_legend').hide();
        showHome();
        d3.select('#frequency_bar').remove();
        d3.select('#tooltip').remove();
        break;
      case 1:
        currentPage = 1;
        $('#searchbar').show();
        $(".visualisation").css({ position: 'absolute' });
        $('#alluvial_legend').hide();

        // Make the Polimi ellipse dissappear
        d3.select("ellipse").transition()
          .attr("rx", 0)
          .attr("ry", 0)
          .style("fill", "#E1BEE7")
          .on("end", d => {
            d3.select("svg").remove();
          });
          d3.select('#frequency_bar').remove();
          d3.select('#tooltip').remove();
          showForceLayout();
        break;
      case 2:
        currentPage = 2;
        $(".visualisation").css({ position: 'relative' });
        d3.select('#tooltip').remove();
        d3.select('#legend').remove();
        $('#alluvial_legend').show();

        // TODO: Go through this
        if (!faculties.includes(bubble.keyword)) {
          $("#back").show();
          d3.selectAll(".keyword").remove();
          exploreKeyword(bubble);
        }
        break;
    }
  }

  $("#back").click(d => {
    d3.select('svg').remove();
    if (currentPage == 1) {
      navigateTo(0);
    } else if (currentPage == 2) {
      navigateTo(1);
    }
  });
});
