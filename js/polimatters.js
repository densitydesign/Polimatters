/*
  Polimatters
*/

let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let colors = { e: "#00FFCA", a: "#FF3054", d: "#EEFF14" };
let faculties = ["a", "e", "d"];
var width = window.innerWidth,
  height = window.innerHeight;
var bubbles = [];
var searchedKeywordObject;
var restart = function() {};
var exploringKeyword = "";
var forceInitialized = false;

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
  "ingegneria meccanica",
  "ingegneria nucleare",
  "ingegneria per l'ambiente e il territorio",
  "ingegneria per l'ambiente e il territorio - environmental and land planning engineering",
  "ingegneria spaziale",
  "biomedical engineering - ingegneria biomedica",
  "civil engineering for risk mitigation",
  "computer science and engineering - ingegneria informatica",
  "environmental and geomatic engineering",
  "management engineering - ingegneria gestionale",
  "materials engineering and nanotechnology",
  "materials engineering and nanotechnology - ingegneria dei materiali e delle nanotecnologie",
  "mechanical engineering - ingegneria meccanica",
  "telecommunication engineering - ingegneria delle telecomunicazioni"
];

let years = [
  "2008-2009",
  "2009-2010",
  "2010-2011",
  "2011-2012",
  "2012-2013",
  "2013-2014",
  "2014-2015",
  "2015-2016"
];

let facultyNodes = {};
let fetchedKeywords = [];
let keywords = [];
let radius = (window.innerWidth / 2) * .4;
let size = null;
let total = 0;

var _relators = [];
var currentPage = 0;
var minimumYear = 2008;
var maximumYear = 2016;
var bubble, text;
var _exploringKeyword;
var mouseEnter, mouseLeave = function() {};
var searched = false;
var searchedKeyword = false;

d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    if (this.parentNode) this.parentNode.appendChild(this);
  });
};

// Fetch data
// 54325 keywords
firebase.database().ref('/keywords').orderByChild("total").once('value', snapshot => {
    var chartConfig = {
        target : 'preloader',
        data_url : 'external_data.json',
        width: 900,
        height: 450,
        val: 90
    };

    var opts = {
      lines: 9,
      length: 9,
      width: 5,
      radius: 14,
      color: '#E0E0E0',
      speed: 1.9,
      trail: 40,
      className: 'spinner'
    };

    var target = document.getElementById(chartConfig.target);

    var spinner = new Spinner(opts).spin(target);
    setTimeout(function() {
        spinner.stop();
        d3.selectAll('#preloader').remove();
    }, 5000);

  snapshot.forEach(keyword => {
    var year_node = { total: 0 };

    // Split by years
    years.forEach(year => {
      if (keyword.val()[year]) {
        var word = keyword.val()[year];
        year_node[year] = { a: 0, d: 0, e: 0, total: 0 }

        architecture.forEach(course => {
          if (Object.keys(word).includes(course))
            year_node[year].a += word[course];
        });

        design.forEach(course => {
          if (Object.keys(word).includes(course))
            year_node[year].d += word[course];
        });

        engineering.forEach(course => {
          if (Object.keys(word).includes(course))
            year_node[year].e += word[course];
        });

        year_node.keyword = keyword.key;
        year_node[year].keyword = keyword.key;
        year_node[year].total = word.total;
        year_node.total += year_node[year].total;

        if (year_node.total >= 15) {
          fetchedKeywords.push(year_node);
        }
      }
    });
  });
}).then(v => {
  console.log("ready!");
  var uniqueKeywords = [];
  $.each(fetchedKeywords, (i, keyword) => {
    if($.inArray(keyword, uniqueKeywords) === -1) uniqueKeywords.push(keyword);
    total += keyword.total;
  });

  total = 20000;

  fetchedKeywords = uniqueKeywords;

  var tip = d3.tip();
  var svg, g, svgHome;

  console.log("total: " + total);

  size = d3.scaleSqrt()
    .domain([0, total])
    .range([0, 96]);

  function initSVGHome() {
    svgHome = d3.select(".visualisation").append("svg")
      .attr("width", window.outerWidth)
      .attr("height", window.innerHeight)

    gHome = svgHome.append("g")
      .attr("class", "g")
      .style("pointer-events", "all");

    gHome.append("rect")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .style("fill", "none");
  }

  function initSVG() {
    svg = d3.select(".visualisation").append("svg")
      .attr("width", window.outerWidth)
      .attr("height", window.innerHeight)
      .attr('position', 'absolute')
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
    $('#intro').show();
    $('#polimi_bubble').show();
    $('#credits').show();
    $('#back').hide();

    initSVGHome();

    var tipBubble = d3.tip();
    tipBubble
      .attr('class', 'd3-tip')
      .attr('id', 'polimi_tooltip')
      .offset([-10, 0])
      .html("<strong style='color: #E0E0E0;'>Touch to Explore!</strong>");

    svgHome.
      attr("id", 'polimi_bubble');

    svgHome.append('ellipse')
      .attr("cx", center.x)
      .attr("cy", center.y)
      .attr("rx", 0)
      .attr("ry", 0)
      .attr("fill", "#F8BBD0")
      .attr('position', 'absolute')
      .on("click", d => {
        $('#intro').hide();
        $('#credits').hide();
        $('#back').show();
        navigateTo(1);
      })
      // .call(tipBubble)
      // .on('mouseover', tipBubble.show())
      .transition()
        .attr("rx", (total / size(total)) * .5)
        .attr("ry", (total / size(total)) * .5)
        // .on('mouseover', tipBubble.show)
        .duration(2000)
        .style("fill", "#C2185B");

    svgHome.append("text")
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .attr("dx", text => { return center.x; })
      .attr("dy", text => { return center.y + 9; })
      .attr("opacity", 0)
      .attr("font-family", "Lato")
      .attr("font-size", 18)
      .text(text => { return "Politecnico di Milano"; })
      .style("fill", text => { return "#E0E0E0"; })
      .transition()
        .attr("opacity", 1);
  }

  function showForceLayout(from, to) {
    forceInitialized = true;

    bubbles = [];

    if (from == 0 && to == 0) {
      from = x1 = minimumYear;
      to = x2 = maximumYear;
    }

    // d3.select('#timeline svg').remove();
    // d3.select('#forceLayout').remove();

    currentPage = 1;

    var departments = [];
    faculties.forEach((faculty, index) => {
      facultyNodes[faculty] = {
        x: center.x + radius * Math.cos(2 * Math.PI * (index / faculties.length)),
        y: center.y + radius * Math.sin(2 * Math.PI * (index / faculties.length))
      }
    });

    // Faculties circles
    _.forEach(facultyNodes, (value, key) => {
      // Push the faculty nodes into the set of keywords (so that they can be mapped together)
      departments.push({
        keyword: key,
        type: "focus",
        positionX: value.x,
        positionY: value.y,
        total: 5000, // TODO To be calculated dynamically with a coefficient to scale.
        color: colors[key]
      });
    });

    /* TODO: Compute the total for each year */
    var data = [
      { year: 2008, total: 0 },
      { year: 2009, total: 0 },
      { year: 2010, total: 0 },
      { year: 2011, total: 0 },
      { year: 2012, total: 0 },
      { year: 2013, total: 0 },
      { year: 2014, total: 0 },
      { year: 2015, total: 0 }
    ];

    data.forEach(object => {
      var year = object.year + "-" + parseInt(++object.year);

      fetchedKeywords.forEach(keyword => {
        if (keyword[year]) object.total += keyword[year].total;
      });
    });

    function computeKeywords() {
      let chosenYears = years.slice(years.indexOf(from + "-" + parseInt(from + 1)), years.indexOf(from + "-" + parseInt(from + 1)) + to - parseInt(from));

      var occurrencesPerYear = [];

      bubbles = [];

      // Dummy keyword in the beginning of the array.
      // For some reason, the first bubble in the array always ticks at 0, 0 even though the cx and cy values are set properly.
      bubbles.push({
        "keyword": "1@337!",
        "total": 0
      });

      // Reset the keywords
      keywords = fetchedKeywords;

      if (searchedKeywordObject) {
        keywords.push(searchedKeywordObject);
      }

      keywords.forEach(keyword => {
        let multiplier = 0;
        let upX = 0;
        let upY = 0;
        let down = 0;
        let colorRed = 0;
        let colorGreen = 0;
        let colorBlue = 0;
        let schools = { a: 0, d: 0, e: 0 };
        let totalOccurrence = 0;

        // loop through the chosen years and find out the total and the ratio for the multiplier! :D
        // TEST for all years
        chosenYears.forEach(year => {
          if (keyword[year]) {
            totalOccurrence += keyword[year].total;
            schools.a += keyword[year].a;
            schools.d += keyword[year].d;
            schools.e += keyword[year].e;
          }
        });

        faculties.forEach(faculty => {
          // Figure out what faculties a keyword belongs to
          var multiplier = parseFloat(schools[faculty] / totalOccurrence);
          upX += multiplier * facultyNodes[faculty].x;
          upY += multiplier * facultyNodes[faculty].y;
          colorRed += multiplier * d3.color(colors[faculty]).r;
          colorGreen += multiplier * d3.color(colors[faculty]).g;
          colorBlue += multiplier * d3.color(colors[faculty]).b;
          down += multiplier;
        });

        if (totalOccurrence > 0) {
          keyword.total = totalOccurrence; // Come on :/
          keyword.positionX = upX / down;
          keyword.positionY = upY / down;
          keyword.a = schools.a;
          keyword.d = schools.d;
          keyword.e = schools.e;
          let color = d3.rgb(colorRed, colorGreen, colorBlue);
          let lightness = 1 / Math.sqrt(Math.pow(keyword.positionX - center.x, 2) + Math.pow(keyword.positionY - center.y, 2));
          keyword.color = color.brighter(lightness / 0.0080);

          bubbles = bubbles.concat(keyword);
        }
      });

      bubbles = bubbles.concat(departments);
    }

    initSVG();

    d3.selectAll(".visualisation svg").attr("id", "forceLayout");

    var formatAxis = d3.format('.0f');

    var margin = { top: 25, right: 25, bottom: 30, left: 25 },
      width = $('#timeline').width() - margin.left - margin.right,
      height = 50;

    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x).tickSize(0),
        yAxis = d3.axisLeft(y).tickSize(0);

    xAxis.tickFormat(formatAxis);

    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("brush", brushed)
        .on("end", snapBrush)

    // TODO: Animate the brush

    var svg = d3.select(".timeline").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", `translate(${margin.left}, ${margin.right})`);

    // var xMin = d3.min(data, d => { return d.year; });
    var xMin = 2008;
    var yMax = Math.max(20, d3.max(data, d => { return d.total; }));

    x.domain([xMin, 2016]);
    y.domain([0, yMax]);

    var num_messages = (dataArray, domainRange) => { return d3.sum(dataArray, d => {
        return d.total >= domainRange.domain()[0] && d.total <= domainRange.domain()[1];
      });
    }

    var messages = context.append("g");
       messages.attr("clip-path", "url(#clip)");
       messages.selectAll("message")
          .data(data)
          .enter().append("rect")
          .attr('class', 'messageContext')
          .attr('fill', "#1DE9B6")
          .style("opacity", 1)
          .attr("x", d => { return x(d.year); })
          .attr("width", width / 8)
          .transition()
            .duration(0)
            .attr("y", d => { return y(d.total); })
            .attr("height", d => { return 50 - y(d.total); });

    context.append("g")
          .attr("class", "brushAxis")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);

    context.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, x.range());

    var selectionRange = 0;
    var x1 = 0, x2 = 0;
    var range = 0;

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
          return "<strong style='color: #E0E0E0;'>Department: </strong> <span style='color: #26C6DA;'>" + department + "</span>";
        }
        return "<strong style='color: #E0E0E0;'>Architecture:</strong> <span style='color: #26C6DA;'>" + bubble.a + "</span> <br> <strong style='color: #E0E0E0;'>Design:</strong> <span style='color: #26C6DA;'>" + bubble.d + "</span> <br> <strong style='color: #E0E0E0;'>Engineering:</strong> <span style='color: #26C6DA;'>" + bubble.e + "</span>";
      });

    var simulation;

    simulation = d3.forceSimulation()
      .force("x", d3.forceX().strength(.1).x(bubble => {
        return bubble.positionX;
      }))
      .force("y", d3.forceY().strength(.1).y(bubble => {
        return bubble.positionY;
      }))
      .force("charge", d3.forceManyBody().strength(-1))
      .force("collide", d3.forceCollide().radius(bubble => {
        return size(bubble.total) + .4;
      }).iterations(1));

    restart = function() {
      if (simulation) simulation.stop();
      bubbles = [];
      computeKeywords();

      var lineScale = d3.scaleLinear()
        .domain([0, 250 / 2])
        .range([0, 5]);

      bubble = g.selectAll(".keyword");
      text = g.selectAll(".keyword-text");

      bubble = bubble.data(bubbles, d => { return d.id; });

      bubble.exit()
        .remove();

      bubble = bubble
        .enter()
        .append("circle")
          .attr("class", "keyword")
          .attr("r", bubble => {
            if (searchedKeywordObject && searchedKeywordObject.keyword == bubble.keyword)
              return 5;
            else return size(bubble.total);
          })
          .style("fill", bubble => {
            return bubble.color;
          })
          .on('click', bubble => {
            if (!bubble.type) navigateTo(2, bubble);
          })
          .on('mouseover', mouseEnter)
          .on('mouseleave', mouseLeave);

      function ticked() {
        // TEST: Try skipping a few ticks.
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

        if (searchedKeyword) {
          searched = true;
          mouseEnter(searchedKeyword);
        }
        if (searchedKeywordObject) {
          searched = true;
          mouseEnter(searchedKeywordObject);
        }
      }

      mouseEnter = function(key) {
        var hoveredKeyword = d3.select(this);

        if (!searched) tip.show(key);

        d3.selectAll("line").remove();

        if (!key.type) {
          faculties.forEach(faculty => {
            g.append("line")
              .attr("x1", key.x)
              .attr("y1", key.y)
              .attr("x2", facultyNodes[faculty].x)
              .attr("y2", facultyNodes[faculty].y)
              .style("stroke", "#E0E0E0")
              .style("stroke-width", d => {
                return lineScale(key[faculty]);
              });
           })

          // TODO: Reduce the opacity of all the nodes except the selected node and the department nodes
          d3.selectAll(".keyword")
            .style("opacity", d => {
              // if (d.type != 'focus') return 0.2;
              if (d.keyword != key.keyword) return 0.2;
              else return 1;
            });
          d3.selectAll(".keyword-text")
            .style("opacity", d => {
                if (d.keyword == key.keyword || d.type == 'focus') return 1;
                else return 0;
            });

          if (key.total == 0) d3.selectAll("line").remove();
        }

        if (hoveredKeyword) hoveredKeyword.moveToFront();
      }

      mouseLeave = bubble => {
        searched = false;
        searchedKeyword = null;

        if (searchedKeywordObject && fetchedKeywords.includes(searchedKeywordObject)) {
          var index = fetchedKeywords.indexOf(searchedKeywordObject);
          if (index > -1)
            fetchedKeywords.splice(index, 1);
        }
        searchedKeywordObject = null;

        tip.hide(bubble);
        d3.selectAll("line").remove();
        d3.selectAll(".keyword")
          .style("opacity", 1);

        bubbles.forEach(b => {
          d3.selectAll(".keyword-text")
            .style("opacity", d => { return d.total > 100 ? 1 : 0; });
        });

        if (bubble.type != "focus") restart();
      }

      // TODO: Labels for the bubbles
      text = text.data(bubbles, bubble => { return bubble.id; });

      text.exit()
        .remove();

      text = text
        .enter()
        .append("text")
        .attr("class", "keyword-text")
          .attr("pointer-events", "none")
          .attr("text-anchor", d => {
            return faculties.includes(d.keyword) ? "middle" : "left";
          })
          .attr("font-family", "Lato")
          .attr("font-size", 15)
          .text(d => {
            if (d.keyword == 'a') return "Architecture";
            else if (d.keyword == 'd') return "Design";
            else if (d.keyword == 'e') return "Engineering";
            else return d.keyword; // TODO: Make dynamic to show only the top 10 or so labels
          })
          .style("fill", d => { return d.keyword == 'a' || d.keyword == 'd' || d.keyword == 'e' ? "#212121" : "#E0E0E0"; })
          .style("opacity", d => { return d.total > 100 ? 1 : 0; });

      if (simulation) {
        simulation.nodes(bubbles).on("tick", ticked);
        simulation.alpha(1).restart();
      }
    }

    svg.call(tip);

    // Tincy rotation
    var speed = 0;
    // d3.timer(function() {
    //   svg.style("transform", `rotate(${speed}deg)`);
    //   speed -= .0125;
    // });

    var paused = false;
    var stopped = false;
    var toYear = 2009;
    var i = 0;
    var delay = 0;

    $('#play').click(d => {
      brushed = false;
      paused = false;
      if (stopped) {
        stopped = false;
        i = 0;
        toYear = 2009;
      }
      $('#pause').show();
      $('#play').hide();
      animate();
    });

    $('#pause').click(d => {
      paused = true;
      $('#play').show();
      $('#pause').hide();
    });

    function animate() {
      setTimeout(function () {
        if (toYear <= maximumYear && !paused && !stopped) {
          d3.select(".brush").transition().call(brush.move, [0, i += width / 8]);
          from = 2008;
          to = toYear++;
          restart();

          delay = 2000;
          animate();
        }
      }, delay);

      if (toYear > maximumYear) {
        paused = true;
        $('#pause').hide();
        $('#play').show();
        i = 0;
        toYear = 2009;
      }
    }

    function brushed() {
      if (!d3.event.sourceEvent) return; // Only transition after input.
      if (!d3.event.selection) return; // Ignore empty selections.

      stopped = true;
      $('#pause').hide();
      $('#play').show();

      if (from == 0 && to == 0) {
        from = x1 = minimumYear;
        to = x2 = maximumYear;
      } else {
        range = d3.event.selection.map(x.invert);

        if (Math.round(range[0]) - range[0] < 0.5 && Math.round(range[1]) - range[1] < 0.5 && Math.round(range[0]) - range[0] > 0 && Math.round(range[1]) - range[1] > 0
          && Math.round(range[1]) - Math.round(range[0]) < 2) {
          x1 = Math.round(range[0]) - 1;
          x2 = Math.round(range[1]) - 1;
        } else {
          x1 = Math.round(range[0]);
          x2 = Math.round(range[1]);
        }

        if (x1 < minimumYear) x1 = minimumYear;
        if (x2 > maximumYear) x2 = maximumYear;

        if (x1 == x2) {
          if (x1 == minimumYear) x2++;
          else if (x2 == maximumYear) x1--;
          else x2++;
        }

        from  = x1;
        to = x2;
      }

      selectionRange = d3.scaleLinear().range([x1, x2]);
      selectionRange.domain([x1, x2]);
    }

    function snapBrush() {
      if (!d3.event.sourceEvent) return; // Only transition after input.
      if (!d3.event.selection) return; // Ignore empty selections.

      restart();

      selectedRange = [x1, x2];
      d3.select(".brush").transition().call(brush.move, selectedRange.map(x));
    }

    restart();
  }

  function exploreKeyword(bubble) {
    var keyword = bubble.keyword;
    exploringKeyword = keyword;

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

        snapshot.forEach(object => {
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

        var addLink = (source, target) => {
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

        // TODO: Remove the links to the relators that have contributed to only 1 thesis.
        // These relators must be aggregated to a single 'others' node.

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

        if (uniqueRelators.length >= 10) {
          nodes.forEach((node, index) => {
            if (uniqueRelators.includes(node.name)) {
              links.forEach(link => {
                if (link.target == node.node && link.value == 1) {
                  relator[relator.indexOf(node.name)] = 'others';
                }
              });
            }
          });
        }

        // else if (uniqueRelators.length > 20) {
        //     nodes.forEach((node, index) => {
        //       if (uniqueRelators.includes(node.name)) {
        //         links.forEach(link => {
        //           if (link.target == node.node && (link.value == 1 || link.value == 2))
        //             relator[relator.indexOf(node.name)] = 'others';
        //         });
        //       }
        //     });
        // }

        allNodes = chosenKeyword.concat(uniqueLanguages, uniqueDegreeTypes, uniqueSchools, Array.from(new Set(relator)));
        nodes = [];

        // Each of these unique values are nodes
        for (var i = 0; i < allNodes.length; i++) {
          var node = {
            "node": i,
            "name": titleCase(allNodes[i])
          };
          nodes.push(node);
        }

        function titleCase(string) {
          return string.replace(/\w\S*/g, word => {
            return word == 'del' || word == 'degli' || word == 'della' || word == 'delle' || word == 'per' || word == 'il'
              || word == 'di' || word == 'dei' || word == 'e' || word == 'i' || word == 'ii' || word == 'iii' || word == 'iv'
              || word == 'v' || word == 'vi' || word == 'for'
              ? word : word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
          });
        }

        // Create links again
        links = [];
        for (var thesis = 0; thesis < numberOfTheses; thesis++) {
          nodes.forEach(sourceNode => {
            nodes.forEach(targetNode => {
              // Check for a link between the source and the target nodes
              if (sourceNode.name.toLowerCase() == keyword_node[thesis] && targetNode.name.toLowerCase() == language[thesis]) {
                addLink(sourceNode.node, targetNode.node);
              } else if (sourceNode.name.toLowerCase() == language[thesis] && targetNode.name.toLowerCase() == degree_type[thesis]) {
                addLink(sourceNode.node, targetNode.node);
              } else if (sourceNode.name.toLowerCase() == degree_type[thesis] && targetNode.name.toLowerCase() == school[thesis]) {
                addLink(sourceNode.node, targetNode.node);
              } else if (sourceNode.name.toLowerCase() == school[thesis] && targetNode.name.toLowerCase() == relator[thesis]) {
                addLink(sourceNode.node, targetNode.node);
              }
            });
          });
        }

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
        var svg = d3.select(".visualisation").append('alluvial').append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        d3.selectAll(".visualisation .alluvial svg").attr("id", "alluvial_chart");

        // TODO: Create a bar on top to show the occurrence of the selected keyword in the schools
        var bar = d3.select(".frequency_bar").append("svg")
          .attr("id", "frequency_bar")
          .attr("width", window.innerWidth) // TODO: Make responsive
          .attr("height", 18);

        var architecturePercent = (bubble.a/bubble.total) * window.innerWidth;
        var designPercent = (bubble.d/bubble.total) * window.innerWidth;
        var engineeringPercent = (bubble.e/bubble.total) * window.innerWidth;

        // Frequency Bar
        var bars = [
          {x: 0, width: architecturePercent, color: colors.a, label: "Architecture"},
          {x: architecturePercent, width: designPercent, color: colors.d, label: "Design"},
          {x: architecturePercent + designPercent, width: engineeringPercent, color: colors.e, label: "Engineering"}
        ];

        bar.selectAll("rect")
          .data(bars)
          .enter()
          .append("rect")
            .attr("id", "frequency_bar")
            .attr("x", bar => { return bar.x; })
            .attr("y", 0)
            .attr("width", bar => { return bar.width; })
            .attr("height", 75)
            .style("fill", bar => { return bar.color; });

        bar.selectAll("text")
          .data(bars)
          .enter()
          .append("text")
            .attr("dx", bar => { return bar.x + 25; })
            .attr("dy", 15)
            .attr("opacity", 0)
            .attr("font-family", "Lato")
            .attr("font-size", 15)
            // .text(bar => { if (bar.width != 0) return bar.label + ": " + Math.round((bar.width/window.innerWidth * 100 * 100) / 100) + "%"; })
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
            .attr("cx", circle => { return circle.x; })
            .attr("cy", circle => { return circle.y; })
            .attr("r", circle => { return circle.r; })
            .style("fill", circle => { return circle.color; });

        legendContainer.selectAll("text")
          .data(circles)
          .enter()
          .append("text")
            .attr("dx", circle => { return circle.x + 25; })
            .attr("dy", circle => { return circle.y + 5; })
            .attr("font-family", "Lato")
            .text(circle => { return circle.label; })
            .style("fill", circle => { return "#E0E0E0"; });

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
          .attr("id", (link, index) => {
            link.id = index;
            return "link-" + index;
          })
          .style("stroke-width", link => {
            return Math.max(1, link.dy);
          })
          .sort((a, b) => {
            return b.dy - a.dy;
          });

        _relators = [];

        // add the link titles
        link.append("title")
          .text(link => {
            if (uniqueRelators.includes(link.target.name)) {
              _relators.push({
                name: link.target.name,
                size: link.value
              });
            }

            return link.source.name + " → " +
              link.target.name + "\n" + format(link.value);
          });

        function highlightLinks(node, i) {
          var remainingNodes = [],
          	nextNodes = [];

          var strokeOpacity = 0;
          if(d3.select(this).attr("data-clicked") == "1") {
          	d3.select(this).attr("data-clicked", "0");
          	strokeOpacity = 0.2;
          } else {
          	d3.select(this).attr("data-clicked", "1");
          	strokeOpacity = 0.5;
          }

          var traverse = [{
          	linkType: "sourceLinks",
          	nodeType: "target"
          }, {
          	linkType: "targetLinks",
          	nodeType: "source"
          }];

          traverse.forEach(step => {
          	node[step.linkType].forEach(link => {
          		remainingNodes.push(link[step.nodeType]);
          		d3.select("#link-" + link.id).style("stroke-opacity", strokeOpacity);
          	});

          	while(remainingNodes.length) {
          		nextNodes = [];
          		remainingNodes.forEach(node => {
          			node[step.linkType].forEach(link => {
          				nextNodes.push(link[step.nodeType]);
          				d3.select("#link-" + link.id).style("stroke-opacity", strokeOpacity);
          			});
          		});

          		remainingNodes = nextNodes;
          	}
          });
        }

        // add in the nodes
        var node = svg.append("g").selectAll("node")
          .data(graph.nodes)
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", node => {
            return `translate(${node.x}, ${node.y})`;
          })
          .on("click", highlightLinks)
          .call(d3.drag()
            .subject(node => {
              return node;
            })
            .on("drag", dragNode)
          )

        // add the rectangles for the nodes
        node.append("rect")
          .attr("height", node => {
            return node.dy;
          })
          .attr("width", sankey.nodeWidth())
          .style("fill", node => {
            // return d.color = color(d.name.replace(/ .*/, ""));
            if (uniqueDegreeTypes.includes(node.name.toLowerCase())) {
              return d3.rgb('#00E5FF');
            } else if (uniqueSchools.includes(node.name.toLowerCase())) {
              return d3.rgb('#F50057');
            } else if (uniqueLanguages.includes(node.name.toLowerCase())) {
              return d3.rgb('#FFC400');
            } else if (uniqueRelators.includes(node.name.toLowerCase()) || node.name.toLowerCase() == 'others') {
              return d3.rgb('#76FF03');
            } else {
              return d3.rgb('#FF3D00');
            }
          })
          .style("stroke", node => {
            if (uniqueDegreeTypes.includes(node.name.toLowerCase())) {
              return d3.rgb('#00E5FF');
            } else if (uniqueSchools.includes(node.name.toLowerCase())) {
              return d3.rgb('#F50057');
            } else if (uniqueLanguages.includes(node.name.toLowerCase())) {
              return d3.rgb('#FFC400');
            } else if (uniqueRelators.includes(node.name.toLowerCase()) || node.name.toLowerCase() == 'others') {
              return d3.rgb('#76FF03');
            } else {
              return d3.rgb('#FF3D00');
            }
          })
          .append("title")
          .text(node => {
            return node.name + "\n" + format(node.value);
          });

        // add in the title for the nodes
        node.append("text")
          .style("fill", '#E0E0E0')
          .attr("x", -6)
          .attr("y", node => {
            return node.dy / 2;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", "end")
          .attr("transform", null)
          .text(node => {
            return node.name;
          })
          .filter(node => {
            return node.x < width / 2;
          })
          .attr("x", 6 + sankey.nodeWidth())
          .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragNode(d) {
          d3.select(this)
            .attr("transform",
              `translate(${d.x}, ${(d.y = Math.max(0, Math.min(height - d.dy, d3.event.y)))})`);
          sankey.relayout();
          link.attr("d", path);
        }
      });
  }

  d3.select(window).on('resize', resize);

  function resize() {
    // TODO: complete this
  }

  function navigateTo(navigate, bubble) {
    keywords = null;
    // d3.select('#timeline svg').remove();

    $('#forceLayout').hide();
    d3.selectAll(".visualisation alluvial").remove();
    $('#timeline svg').hide();
    $('#searchResults').hide();
    $('.logo').hide();
    $('#play').hide();
    $('#title').show();
    $('#pause').hide();
    d3.select('#frequency_bar').remove();
    $('#explore_relators').hide();
    $('#explore_theses').hide();
    switch (navigate) {
      case 0:
        d3.selectAll('#polimi_bubble').remove();
        $('#title').text('Polimatters').css("font-size", "75px");
        currentPage = 0;
        $(".visualisation").css({ position: 'absolute' });
        $('#searchbar').hide();
        $('#alluvial_legend').hide();
        $('.logo').show();
        showHome();
        break;
      case 1:
        $('#title').text('The keywords used in 20.277 theses of Politecnico di Milano').css("font-size", "45px");
        currentPage = 1;
        $('#searchbar').show();
        $(".visualisation").css({ position: 'absolute' });
        $('#alluvial_legend').hide();
        $('#play').show();
        $('#pause').hide();
        $('#forceLayout').show();

        // Make the Polimi ellipse dissappear

        console.log(forceInitialized)

        if (!forceInitialized) {
          d3.select("ellipse").transition()
          .attr("rx", 0)
          .attr("ry", 0)
          .style("fill", "#C2185B")
          .on("end", d => {
            d3.select("svg").remove();
          });
          d3.selectAll('#frequency_bar').remove();
          d3.selectAll('#tooltip').remove();

          if (!forceInitialized)
            showForceLayout(0, 0);
        } else {
          restart();
          $('#timeline svg').show();
          d3.select("svg ellipse").remove();
          d3.select("svg text").remove();
          d3.selectAll('#alluvial_chart').remove();
          $('#forceLayout').show();
        }

        restart();
        $('#search_query').val('');
        $('#searchResults').hide();
        $("#searchResults").empty();
        break;
      case 2:
        // $('#title').text(bubble.keyword).css("font-size", "45px");
        $('#title').hide();
        currentPage = 2;
        $(".visualisation").css({ position: 'relative' });
        // d3.select('#tooltip').remove();
        d3.select('#legend').remove();
        $('#alluvial_legend').show();
        $('#explore_relators').show();
        $('#explore_theses').show();
        $('#forceLayout').hide();

        _exploringKeyword = bubble;

        $("#back").show();
        exploreKeyword(bubble);
        break;
    }
  }

  $("#back").click(d => {
    if (currentPage == 1) {
      navigateTo(0);
    } else if (currentPage == 2) {
      navigateTo(1);
    }
  });
});

function showTheses() {
  var input = _exploringKeyword.keyword;
  var query = input.toLowerCase();
  var ul = document.getElementById('thesesResults');

  // Remove previous listener on the reference
  firebase.database().ref('metadata').off();

  firebase.database().ref('metadata/' + input).once('value', snapshot => {
    snapshot.forEach(thesis => {
      $("#thesesResults").append(
        $("<li>", {}).append(
          $("<a>", { href: thesis.val().handle, target: "_blank" }).text(
            thesis.val().title
          )
        )
      )
    });
  });
}

$('#search_clear').click(d => {
  mouseLeave();
  $('#search_query').val('');
  $('#searchResults').hide();
  $("#searchResults").empty();
});

function search() {
  var input = document.getElementById('search_query');
  var query = input.value.toLowerCase();
  var ul = document.getElementById('searchResults');
  $('#searchResults').show();

  // Remove previous listener on the reference
  firebase.database().ref('keywords').off();

  if (query != '') {
    var found = false;
    firebase.database().ref('keywords').orderByKey().startAt(query).endAt(query + "\uf8ff").once('value', snapshot => {
      $("#searchResults").empty();
      snapshot.forEach(result => {
        $("#searchResults").append($("<li>").text(result.key).on('click', d => {
          $('#searchResults').hide();
          d3.selectAll(".keyword")
            .filter(node => { return node.keyword == result.key})
            .each(node => { found = true; searched = true; searchedKeyword = node; mouseEnter(node); });

          if (!found) {
            firebase.database().ref('keywords/' + result.key).once('value', snapshot => {
              searchedKeywordObject = snapshot.val();
              var year_node = { total: 0 };

              let chosenYears = years;
              var occurrencesPerYear = [];
              let multiplier = 0;
              let upX = 0;
              let upY = 0;
              let down = 0;
              let colorRed = 0;
              let colorGreen = 0;
              let colorBlue = 0;
              let schools = { a: 0, d: 0, e: 0 };
              let totalOccurrence = 0;

              // Split by years
              years.forEach(year => {
                if (searchedKeywordObject[year]) {
                  var word = searchedKeywordObject[year];
                  year_node[year] = { a: 0, d: 0, e: 0, total: 0 }

                  architecture.forEach(course => {
                    if (Object.keys(word).includes(course))
                      year_node[year].a += word[course];
                  });

                  design.forEach(course => {
                    if (Object.keys(word).includes(course))
                      year_node[year].d += word[course];
                  });

                  engineering.forEach(course => {
                    if (Object.keys(word).includes(course))
                      year_node[year].e += word[course];
                  });

                  year_node.keyword = result.key;
                  year_node[year].keyword = result.key;
                  year_node[year].total = word.total;
                  year_node.total += year_node[year].total;
                }
              });

              searchedKeywordObject = year_node;

              restart();
            });
          }
        }));
      });
    });
  } else {
    $('#search_query').val('');
    $('#searchResults').hide();
    $("#searchResults").empty();
  }
}
