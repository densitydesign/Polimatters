// Bubble object prototype
function Bubble(keyword, architecture, design, engineering) {
  this.keyword = keyword;
  this.a = architecture;
  this.d = design;
  this.e = engineering;
  this.total = a.total + d.total + e.total;
}

let center = [window.innerWidth / 2, window.innerHeight / 2];
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
  "ingegneria meccanica",
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

var page = ["home", "departments", "keyword"];
var currentPage = page[0];

// Fetch data
// 54325 keywords
firebase.database().ref('/keywords').orderByChild('total').startAt(15).once('value', snapshot => {
  snapshot.forEach(keyword => {
    var word = keyword.val();
    var final = {};
    final.a = 0;
    final.d = 0;
    final.e = 0;

    architecture.forEach(course => {
      if (_.includes(Object.keys(word), course))
        final.a += word[course];
    });

    design.forEach(course => {
      if (_.includes(Object.keys(word), course))
        final.d += word[course];
    });

    engineering.forEach(course => {
      if (_.includes(Object.keys(word), course))
        final.e += word[course];
    });

    final.keyword = keyword.key;
    final.total = word.total;
    keywords.push(final);
    total += final.total;
  });
}).then(v => {
  size = d3.scaleSqrt()
    .domain([0, total])
    .range([0, 96]);

  // Faculties circles
  faculties.forEach(function(faculty, index) {
    facultyNodes[faculty] = [center[0] + radius * Math.cos(2 * Math.PI * (index / faculties.length)), center[1] + radius * Math.sin(2 * Math.PI * (index / faculties.length))]
  });

  keywords.forEach(function(keyword) {
    let upX = 0;
    let upY = 0;
    let down = 0;
    let colorRed = 0;
    let colorGreen = 0;
    let colorBlue = 0;

    var keys = Object.keys(keyword);

    faculties.forEach(function(faculty) {
      // Figure out faculties a keyword belongs to
      var multiplier = parseFloat(keyword[faculty] / keyword.total);
      upX += multiplier * facultyNodes[faculty][0]; // X
      upY += multiplier * facultyNodes[faculty][1]; // Y
      colorRed += multiplier * d3.color(colors[faculty]).r;
      colorGreen += multiplier * d3.color(colors[faculty]).g;
      colorBlue += multiplier * d3.color(colors[faculty]).b;
      down += multiplier;
    });

    keyword.positionX = upX / down;
    keyword.positionY = upY / down;

    let color = d3.rgb(colorRed, colorGreen, colorBlue);
    let lightness = 1 / Math.sqrt(Math.pow(keyword.positionX - center[0], 2) + Math.pow(keyword.positionY - center[1], 2));
    keyword.color = color.brighter(lightness / 0.0080);
  });

  var bubbles = keywords;

  _.forEach(facultyNodes, function(value, key) {
    // Push the faculty nodes into the set of keywords (so that they can be mapped together)
    bubbles.push({
      keyword: key,
      type: "focus",
      positionX: value[0],
      positionY: value[1],
      total: 2000, // TODO To be calculated dynamically with a coefficient to scale.
      color: colors[key]
    });
  });

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(bubble) {
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
    .force("x", d3.forceX().strength(.2).x(function(bubble) {
      return bubble.positionX;
    }))
    .force("y", d3.forceY().strength(.2).y(function(bubble) {
      return bubble.positionY;
    }))
    .force("charge", d3.forceManyBody().strength(-1))
    .force("collide", d3.forceCollide().radius(function(bubble) {
      return size(bubble.total) + 1;
    }).iterations(2))
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2 - 20));

  simulation
    .nodes(bubbles)
    .on("tick", ticked);

  simulation.stop();

  function ticked() {
    bubble.attr("cx", function(bubble) {
      return bubble.x;
    }).attr("cy", function(bubble) {
      return bubble.y;
    });
  }

  var svg = d3.select(".visualisation").append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .call(d3.zoom()
      .scaleExtent([1 / 2, 4])
      .on("zoom", zoomed)
    )

  var g = svg.append("g")
    .attr("class", "g")
    .style("pointer-events", "all");

  g.append("rect")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .style("fill", "none");

  var sel = g.append("g")
    .attr("class", "sel");

  function zoomed() {
    g.attr("transform", d3.event.transform);
  }

  var bubble = g.selectAll(".keyword")
    .data(bubbles)
    .enter().append("circle")
    .attr("class", "keyword")
    .attr("r", function(bubble) {
      return size(bubble.total);
    })
    .style("fill", function(bubble) {
      return bubble.color;
    })
    .on('click', function(d) {
      currentPage = page[2];

      if (!faculties.includes(bubble.keyword)) {
        $("#back").show();
        d3.selectAll(".keyword").style("opacity", 0);
        tip.attr('class', '')
          .html('');
      }

      exploreKeyword(bubble.keyword);
    })
    .on('mouseenter', tip.show)
    .on('mouseleave', tip.hide);

  showHome();

  function showHome() {
    $('#title').show();
    $('#intro').show();
    $('#credits').show();
    $('#back').hide();

    // Polimi Circle
    var polimiBubble = svg.append("ellipse")
      .attr("cx", center[0])
      .attr("cy", center[1])
      .attr("rx", 0)
      .attr("ry", 0)
      .attr("fill", "#E1BEE7")
      .on("click", function(d) {
        $('#title').hide();
        $('#intro').hide();
        $('#credits').hide();
        $('#back').show();
        d3.select("ellipse").transition()
          .attr("rx", 0)
          .attr("ry", 0)
          .style("fill", "#E1BEE7");
        currentPage = page[1];
        showDepartments();
      })
      .transition()
        .attr("rx", (total / size(total)) * 0.5)
        .attr("ry", (total / size(total)) * 0.5)
        .style("fill", "#6A1B9A")
  }

  function showDepartments() {
    currentPage = page[1];
    simulation.restart();
    // svg.call(tip);

    // Tincy rotation
    var speed = 0;
    // d3.timer(function() {
    //   svg.fill
    //   svg.style("transform", "rotate(" + speed + "deg)");
    //   speed -= .0125;
    // });
  }

  function exploreKeyword(keyword) {
    currentPage = page[2];
    var units = "Widgets";

    // set the dimensions and margins of the graph
    var margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      },
      width = 700 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // format variables
    var formatNumber = d3.format(",.0f"), // zero decimal places
      format = function(d) {
        return formatNumber(d) + " " + units;
      },
      color = d3.scaleOrdinal(d3.schemeCategory20);

    // append the svg object to the body of the page
    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Set the sankey diagram properties
    var sankey = d3.sankey()
      .nodeWidth(36)
      .nodePadding(40)
      .size([width, height]);

    var path = sankey.link();

    // load the data
    d3.json("js/data.json", function(error, graph) {

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
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        })
        .sort(function(a, b) {
          return b.dy - a.dy;
        });

      // add the link titles
      link.append("title")
        .text(function(d) {
          return d.source.name + " → " +
            d.target.name + "\n" + format(d.value);
        });

      // add in the nodes
      var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.drag()
          .subject(function(d) {
            return d;
          })
          .on("start", function() {
            this.parentNode.appendChild(this);
          })
          .on("drag", dragmove));

      // add the rectangles for the nodes
      node.append("rect")
        .attr("height", function(d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
          return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function(d) {
          return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function(d) {
          return d.name + "\n" + format(d.value);
        });

      // add in the title for the nodes
      node.append("text")
        .attr("x", -6)
        .attr("y", function(d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) {
          return d.name;
        })
        .filter(function(d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

      // the function for moving the nodes
      function dragmove(d) {
      //   d3.select(this)
      //     .attr("transform",
      //       "translate(" +
      //       d.x + "," +
      //       (d.y = Math.max(
      //         0, Math.min(height - d.dy, d3.event.y))) + ")");
      //   sankey.relayout();
      //   link.attr("d", path);
      }
    });
  }

  $("#back").click(function(d) {
    if (currentPage == page[1]) {
      currentPage = page[0];
      d3.selectAll(".keyword").style("opacity", 0);
      showHome();
    } else if (currentPage == page[2]) {
      currentPage = page[1];
      d3.selectAll(".keyword").style("opacity", 1);
    }
  });
});
