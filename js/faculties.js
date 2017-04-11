// Bubble object prototype
function Bubble(keyword, architecture, design, engineering) {
  this.keyword = keyword;
  this.architecture = architecture;
  this.design = design;
  this.engineering = engineering;
  this.total = architecture.total + design.total + engineering.total;
}

let center = [window.innerWidth / 2, window.innerHeight / 2];
let colors = {
  "engineering": "#00FFCA",
  "architecture": "#FF3054",
  "design": "#EEFF14"
};

let faculties = [
  "architecture",
  "engineering",
  "design"
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
let radius = (window.innerWidth / 2) * .5;
let size = null;
let total = 0;

// Fetch data
firebase.database().ref('/keywords').once('value', snapshot => {
  snapshot.forEach(keyword => {
    var word = keyword.val();
    var final = {};
    final.architecture = 0;
    final.design = 0;
    final.engineering = 0;

    architecture.forEach(course => {
      if (_.includes(Object.keys(word), course))
        final.architecture += word[course];
    });

    design.forEach(course => {
      if (_.includes(Object.keys(word), course))
        final.design += word[course];
    });

    engineering.forEach(course => {
      if (_.includes(Object.keys(word), course))
        final.engineering += word[course];
    });

    final.keyword = keyword.key;
    final.total = word.total;

    if (word.total > 30) {
      keywords.push(final);
      // Calculate total number of keywords
      total += final.total;
    }
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

    // Test RGB
    // colorRed = 133;
    // colorGreen = 120;
    // colorBlue = 0;

    let color = d3.rgb(colorRed, colorGreen, colorBlue);
    let lightness = 1 / Math.sqrt(Math.pow(keyword.positionX - center[0], 2) + Math.pow(keyword.positionY - center[1], 2));
    keyword.color = color.brighter(lightness / 0.0080);
  });

  _.forEach(facultyNodes, function(value, key) {
    // Push the faculty nodes into the set of keywords (so that they can be mapped together)
    keywords.push({
      keyword: key,
      type: "focus",
      positionX: value[0],
      positionY: value[1],
      total: 2000, // TODO To be calculated dynamically with a coefficient to scale.
      color: colors[key]
    });
  });

  var bubbles = keywords;

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
    .force("center", d3.forceCenter(window.outerWidth / 2, window.outerHeight / 2 - 20));

  simulation
    .nodes(keywords)
    .on("tick", ticked);

  let svg = d3.select("body").append("svg")
      .attr("width", window.outerWidth)
      .attr("height", window.outerHeight)
      .call(d3.zoom()
          .scaleExtent([1 / 2, 4])
          .on("zoom", zoomed)
      );

  var g = svg.append("g")
      .attr("class", "g")
      .style("pointer-events", "all");

  g.append("rect")
      .attr("width", window.outerWidth)
      .attr("height", window.outerHeight)
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
        // .style("stroke", function(d, i) {
        //     return d.type ? colors[d.keyword] : "none"
        // })
        // .style("stroke-width", 5)
        // .style("totality", .9)
        // .on("mouseenter", mouseEnter)
        // .on("mouseleave", mouseLeave);

  // bubble.filter(function(d) {
  //         return d.type;
  //     })
  //     .attr("id", function(d) {
  //         return d.keyword.replace(/\&/g, "")
  //     });

  // var tooltip = g.selectAll(".keyword-txt").data(bubbles)
  //     .enter().append("text")
  //     .attr("class", function(d) {
  //         return d.type ? "keyword-txt keyword-attractor" : "keyword-txt k" + d.keyword.replace(/ /g, "_")
  //     })
  //     .attr("text-anchor", function(d) {
  //         return d.type ? "middle" : "left";
  //     })
  //     .attr("dy", 6)
  //     .style("opacity", function(d) {
  //         return size(d.total) > 8 ? 1 : 0
  //     })
  //     .style("fill", function(d) {
  //         return d.type ? "#040404" : "#fcfff7";
  //     })
  //     .text(function(d) {
  //         return d.keyword;
  //     })
  //
  // tooltip.filter(function(d) {
  //         return d.type
  //     })
  //     .attr("id", function(d) {
  //         return "txt_" + d.keyword.replace(/\&/g, "");
  //     })

  // function mouseEnter(d) {
  //     mouseLeave();
  //
  //     var id = d3.select(this).attr("id")
  //
  //     if (id) {
  //
  //         d3.selectAll(".keyword:not([id])").filter(function(e) {
  //             return e[id] > 0
  //         }).style("opacity", 1)
  //
  //     } else {
  //         console.log(d);
  //
  //         d3.selectAll(".keyword-txt:not([id])").style("opacity", 0)
  //         d3.select(".k" + d.keyword.replace(/ /g, "_")).style("opacity", 1)
  //
  //         _.forEach(d, function(v, k) {
  //             if (v > 0 && k in faculties) {
  //
  //                 $(".info-cats").append("<div style='color:" + cols[k] + "'>" + k + ": <span>" + v + "</span></div>");
  //
  //                 sel.append("line")
  //                     .attr("x1", d3.select("#" + k.replace(/\&/g, "")).attr("cx"))
  //                     .attr("x2", d.x)
  //                     .attr("y1", d3.select("#" + k.replace(/\&/g, "")).attr("cy"))
  //                     .attr("y2", d.y)
  //                     .style("stroke", "#fcfff7")
  //                     .style("stroke-width", function(d) {
  //                         return strscale(v)
  //                     });
  //             }
  //         })
  //         $(".curr-key h1").text(d.keyword)
  //         $(".curr-key").show();
  //     }
  //
  //     d3.selectAll(".keyword:not([id])").style("opacity", .3)
  //     d3.select(this).style("opacity", 1)
  // }
  //
  // function mouseLeave(d) {
  //     d3.selectAll(".keyword").style("opacity", .9)
  //     d3.selectAll(".keyword-txt").style("opacity", function(d) {
  //             return size(d.total) > 8 ? 1 : 0
  //         })
  //         //d3.select("."+d.keyword.replace(/ /g,"_")).style("opacity",function(d){return siz(d.tot)>8 ? 1 : 0})
  //     d3.select(".sel").selectAll("*").remove();
  //     $(".curr-key").hide();
  //     $(".info-cats").empty();
  // }

  // Tincy rotation
  var speed = 0;
  // d3.timer(function() {
  //   svg.fill
  //   svg.style("transform", "rotate(" + speed + "deg)");
  //   speed -= .0125;
  // });

  function ticked() {
    bubble.attr("cx", function(bubble) {
        return bubble.x;
      }).attr("cy", function(bubble) {
        return bubble.y;
      });
  }
});
