var data = [
{"id":367, "winner":null, "created_at":"2014-05-07T23:33:21.353Z", "updated_at":"2014-05-07T23:33:21.353Z", "ancestry":null, "ancestry_depth":0, "team_1_id":null, "team_2_id":null, "team_1_score":0, "team_2_score":0, "children":[
{"id":365, "winner":null, "created_at":"2014-05-07T23:33:21.328Z", "updated_at":"2014-05-07T23:33:21.358Z", "ancestry":"367", "ancestry_depth":1, "team_1_id":null, "team_2_id":null, "team_1_score":0, "team_2_score":0, "children":[
{"id":361, "winner":null, "created_at":"2014-05-07T23:33:21.293Z", "updated_at":"2014-05-07T23:33:21.355Z", "ancestry":"367/365", "ancestry_depth":2, "team_1_id":14, "team_2_id":13, "team_1_score":0, "team_2_score":0, "children":[]
}, 
{"id":362, "winner":null, "created_at":"2014-05-07T23:33:21.303Z", "updated_at":"2014-05-07T23:33:21.357Z", "ancestry":"367/365", "ancestry_depth":2, "team_1_id":15, "team_2_id":9, "team_1_score":0, "team_2_score":0, "children":[]
}]
}, 
{"id":366, "winner":null, "created_at":"2014-05-07T23:33:21.345Z", "updated_at":"2014-05-07T23:33:21.363Z", "ancestry":"367", "ancestry_depth":1, "team_1_id":null, "team_2_id":null, "team_1_score":0, "team_2_score":0, "children":[
{"id":363, "winner":null, "created_at":"2014-05-07T23:33:21.305Z", "updated_at":"2014-05-07T23:33:21.361Z", "ancestry":"367/366", "ancestry_depth":2, "team_1_id":16, "team_2_id":12, "team_1_score":0, "team_2_score":0, "children":[]
}, 
{"id":364, "winner":null, "created_at":"2014-05-07T23:33:21.306Z", "updated_at":"2014-05-07T23:33:21.362Z", "ancestry":"367/366", "ancestry_depth":2, "team_1_id":10, "team_2_id":11, "team_1_score":0, "team_2_score":0, "children":[]}]}]}
];
  

// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
  map[node.id] = node;
  return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
  // add to parent
  var ancestry_depth = dataMap[node.ancestry_depth];
  if (ancestry_depth) {
    // create child array if it doesn't exist
    (ancestry_depth.children || (ancestry_depth.children = []))
      // add node to child array
      .push(node);
  } else {
    // parent is null or missing
    treeData.push(node);
  }
});


// function tree(nodes)
// {
//   var nodeById = {};

//   nodes.forEach(function(d)
//   {
//     nodeById[d.id] = d;
//   });

//   nodes.forEach(function(d)
//   {
//     if ("ancestry_depth" in d)
//     {
//       var ancestry_depth = nodeById[d.ancestry_depth];
//       if (ancestry_depth.children) ancestry_depth.children.push(d);
//       else ancestry_depth.children = [d];
//     }
//   });
// }

// ************** Generate the tree diagram  *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 960 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom;
  
var i = 0;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
  
update(root);

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("circle")
    .attr("r", 10)
    .style("fill", "#fff");

  nodeEnter.append("text")
    .attr("x", function(d) { 
      return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { 
      return d.children || d._children ? "end" : "start"; })
    .text(function(d) 
      { 
        return d.team_1_id + " vs. " + d.team_2_id; 
      })
    .style("fill-opacity", 1);

  // Declare the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", diagonal);

  }