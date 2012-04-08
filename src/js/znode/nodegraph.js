// Declare the NodeGraph function
function NodeGraph(){
  var win = $(window); // window selector
  var canvas = $("#canvas"); // canvas element selector
  var overlay = $("#overlay"); // overlay element selector
  var currentNode;
  var currentConnection = {};
  var connections = {};
  var connectionId = 0;
  var newNode;
  var nodes = {};
  var nodeId = 0;
  var mouseX = 0, mouseY = 0;
  var loops = [];
  var pathEnd = {};
  var zindex = 1;
  var hitConnect;
  var key = {};
  var SHIFT = 16;
  var topHeight = $("#controls").height();
  
  // Create a new Raphael object for the canvas element
  var paper = new Raphael("canvas", "100", "100");

  // Declare the function to resize the Paper
  function resizePaper(){
    //paper.setSize(win.width(), win.height() - topHeight);
    paper.setSize(4000, 3000);
  }
  // Call the function to resize the Paper
  win.resize(resizePaper);
  resizePaper();
  
  // Append the menu element to the canvas
  canvas.append("<ul id='menu'><li>Left<\/li><li>Right<\/li><li>Top<\/li><li>Bottom<\/li><\/ul>");
  var menu = $("#menu");  // menu element selector
  // Add styling to the new menu element
  menu.css({"position" : "absolute", "left" : 100, "top" : 0, "z-index" : 5000, "border" : "1px solid gray", "padding" : 0});
  // Hide the menu by default
  menu.hide();
  
  // Append the new hit element to the canvas
  canvas.append("<div id='hit' />");
  hitConnect = $("#hit");
  // Add styling to the new hit element
  hitConnect.css({"position" : "absolute", "left" : 100, "top" : 0, "z-index" : 4000, "border" : "none", 
                  "width" : 10, "height": 10, "cursor":"pointer", "font-size": "1px"});
                  
  // Add a hover event handler to the items in the menu element
  $("#menu li").hover(function(){
    $(this).css("background-color", "#cccccc");
  },
  // Use an anonymous function to define the click event handler that hides the file menu
  function(){
    $(this).css("background-color", "white");
  }).click(function(){
    menu.hide();
    var dir = $(this).text();
    connectNode(dir);
  });
  
  // Declare the function to connect nodes together
  function connectNode(dir){
    var node, x, y;
    dir = dir.toLowerCase();
    
    
    
      
    if (dir == "left"){
      x = pathEnd.x + 5;
      y = pathEnd.y + topHeight - currentNode.height() / 2;
      
    }else if (dir == "right"){
      x = pathEnd.x - currentNode.width() - 5;
      y = pathEnd.y + topHeight - currentNode.height() / 2;
    }else if (dir == "top"){
      x = pathEnd.x - currentNode.width() / 2;
      y = pathEnd.y + topHeight + 5;
    }else if (dir == "bottom"){
      x = pathEnd.x - currentNode.width() / 2;
      y = pathEnd.y + topHeight - 5 - currentNode.height();
    }
    
 
    // Create a new Node object
    node = new Node(x, y, currentNode.width(), currentNode.height());
    // Save the new connection between these nodes
    saveConnection(node, dir);
    // Point to the new Node as the current node
    currentNode = node;
  }
  
  // Declare the function to create a new connection between nodes
  function createConnection(a, conA, b, conB){
      var link = paper.path("M 0 0 L 1 1");
      link.attr({"stroke-width":2});
      link.parent = a[conA];
      
      a.addConnection(link);
      currentConnection = link;
      currentNode = a;
      saveConnection(b, conB);
  }
  
  // Declare the function to save a new connection
  function saveConnection(node, dir){
    if (!currentConnection) return;
    if (!currentConnection.parent) return;
    
    currentConnection.startNode = currentNode;
    currentConnection.endNode = node;
    currentConnection.startConnection = currentConnection.parent;
    currentConnection.endConnection = node[dir.toLowerCase()];
    
    currentConnection.id = connectionId;
    connections[connectionId] = currentConnection;
    connectionId++;
    
    currentNode.updateConnections();
    node.addConnection(currentConnection);
    
    // Create mouse event handlers on the current connection
    $(currentConnection.node).mouseenter(function(){
      this.raphael.attr("stroke","#FF0000");  // highlight in red
    }).mouseleave(function(){
      this.raphael.attr("stroke","#000000");  // return to black
    }).click(function(){  // clicking on a connection triggers a delete
      if (confirm("Are you sure you want to delete this connection?")){
        this.raphael.remove();
        delete connections[this.raphael.id];
      }
    });
  }
  
  // Create mouse handler event
  canvas.mousedown(function(e){
    if (menu.css("display") == "block"){
      if (e.target.tagName != "LI"){
        menu.hide();
        currentConnection.remove();
      }
    }
  });
  
  // Add a key stroke event handler to the document element
  $(document).keydown(function(e){
    key[e.keyCode] = true;
  }).keyup(function(e){
    key[e.keyCode] = false;
  });
  
  // Add a mouse event handler to the document element
  $(document).mousemove(function(e){
    mouseX = e.pageX;
    mouseY = e.pageY - topHeight;
  }).mouseup(function(e){
    overlay.hide();  // hide the overlay element
    var creatingNewNode = newNode;
    
    hitConnect.css({"left":mouseX - 5, "top":mouseY + topHeight - 5});
    for (var i in nodes){
      if (nodes[i]){
        var n = nodes[i];
        if (n != currentNode){
          var nLoc = n.content.position();
          if (hitTest(toGlobal(nLoc, n.left), hitConnect)){
            saveConnection(n, "left");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.top), hitConnect)){
            saveConnection(n, "top");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.right), hitConnect)){
            saveConnection(n, "right");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.bottom), hitConnect)){
            saveConnection(n, "bottom");
            newNode = false;
            break;
          }
        }
      }
    }
    hitConnect.css("left", "-100px");
    
    if (newNode){
      if (key[SHIFT]){
        menu.css({"left":mouseX - 10, "top":mouseY});
        menu.show();
      }else{
        var dir;
        var currDir = currentConnection.parent.attr("class");
        if (currDir == "left"){
          dir = "right";
        }else if (currDir == "right"){
          dir = "left";
        }else if (currDir == "top"){
          dir = "bottom";
        }else if (currDir == "bottom"){
          dir = "top";
        }
        
        if (pathEnd.x == undefined || pathEnd.y == undefined){
          currentConnection.remove();
        }else{
          connectNode(dir);
        }
      }
    }
    newNode = false;
    
    for (var i in loops){
      clearInterval(loops[i]);
    }
    try{
      if (loops.length > 0) document.selection.empty();
    }catch(e){}
    loops = [];
    
    if (creatingNewNode) currentNode.txt[0].focus();
  });
  
  // Declare the toGlobal function
  function toGlobal(np, c){
    var l = c.position();
    return {position : function(){ return {left: l.left + np.left, top : l.top + np.top}; },
            width : function(){ return c.width(); },
            height : function(){ return c.height(); }};
  }
  
  // Declare the function to show the Overlay
  function showOverlay(){
    overlay.show();
    overlay.css({"width" : win.width(), "height" : win.height()}); //, "opacity": 0.1});
  }
  
  // Declare the function called when starting to drag
  function startDrag(element, bounds, dragCallback){
    showOverlay();
    var startX = mouseX - element.position().left;
    var startY = mouseY - element.position().top;
    if (!dragCallback) dragCallback = function(){};
      var id = setInterval(function(){
      var x = mouseX - startX;
      var y = mouseY - startY;
      if (bounds){
        if (x < bounds.left) x = bounds.left;
        if (x > bounds.right) x = bounds.right;
        if (y < bounds.top) y = bounds.top;
        if (y > bounds.bottom) y = bounds.bottom;
      }
      element.css("left", x).css("top",y);
      dragCallback();
    },topHeight);
    loops.push(id);
  }
  
  
  // Declare the function to construct a Node
  function Node(xp, yp, w, h, noDelete, forceId){
    
    if (forceId){
       nodeId = forceId;
    }
    // Track this Node in the nodes array
    this.id = nodeId;
    nodes[nodeId] = this;
    nodeId++;
    
    var curr = this;
    // No connections to start
    this.connections = {};
    var connectionIndex = 0;
    
    // Add connection
    this.addConnection = function(c){
      curr.connections[connectionIndex++] = c;
      return c;
    }
    
    // Append the node element (div) to the canvas
    canvas.append("<div class='node'/>");
    var n = $(".node").last();
    // Add styling to the new node
    n.css({"position" : "absolute",
           "display" : "block",
           "left" : xp, "top" : yp,
           "width" : w, "height" : h,   
           "border" : "1px solid gray",
           "background-color" : "white"});
    // Put the new node on top
    n.css("z-index", zindex++);
    n.css("-moz-box-shadow", "2px 2px 3px #000000");
    n.css("-webkit-box-shadow", "2px 2px 3px #000000");
    n.css("box-shadow", "2px 2px 3px #000000");
           
    this.content = n;
    
    this.width = function(){
      return n.width();
    }
    this.height = function(){
      return n.height();
    }
    this.x = function(){
      return n.position().left;
    }
    this.y = function(){
      return n.position().top;
    }
         
    var nodeWidth = n.width();
    var nodeHeight = n.height();
           
    // Append the bar element to the node
    n.append("<div class='bar'/>");
    var bar = $(".node .bar").last();
    // Style both the node and the bar element
    bar.css({"height" : "10px", 
             "background-color" : "gray",
             "background-image" : "-webkit-gradient(linear, 100% 0%, 0% 100%, from(cyan), to(blue))",
             "background-image" : "-moz-linear-gradient(-45deg, cyan, blue)",
             "padding" : "0", "margin": "0",
             "font-size" : "9px", "cursor" : "pointer"});
             
             
    // Add the delete icon-button to the bar on this node
    if (!noDelete){
      n.append("<div class='ex'>X<\/div>");
      var ex = $(".node .ex").last();
      // Style the 'x' icon in the bar on the node
      ex.css({"position":"absolute","padding-right" : 2, "padding-top" : 1, "padding-left" : 2,
              "color" : "white", "font-family" : "sans-serif",
              "top" : 0, "left": 0, "cursor": "pointer",
              "font-size" : "7px", "background-color" : "gray", "z-index" : 100});
      // Set a hover event handler on the 'x' icon
      ex.hover(function(){
        ex.css("color","black");
      }, function(){
        ex.css("color","white");
        // Set a click event handler on the 'x' icon
      }).click(function(){
        // Prompt user to confirm intent to delete
        if (confirm("Are you sure you want to delete this node?")){
          curr.remove();
        }
      });
    }
    
    
    
    
    
    
    // Append a details element to the Node
    n.append("<div class='details'>?</div>");
    var details = $(".node .details").last();
    // Style both the Node and the details element
    details.css({"position":"absolute","padding-right" : 2, "padding-top" : 1, "padding-left" : 2,
            "color" : "white", "font-family" : "sans-serif",
            "top" : 0, "right": 0, "cursor": "pointer",
            "font-size" : "7px", "background-color" : "gray", "z-index" : 100});
      // Create a hover event handler
      details.hover(function(){
      details.css("color","black");
    }, function(){
      details.css("color","white");
      // Define the click event handler on the details element
    }).click(function(){
      var temp = $(this).siblings('.nodecomp');
      temp.toggle();
      //$("#compview").show();
    });
    
    // Append an input element to the node to store the node's name.
    n.append("<div class='nodename'><input type='text' class='nodename' size='20' spellcheck='false'></input></div>");
    var myinput = $(".nodename").last(); // need this to get its height later.
    this.nodename = myinput; // need this for the write out to JSON file.
    
    
    // Use the content in input as the NodeName
    this.setNodeName = function (myName) {
      this.nodename.val(myName); // val() because nodename is an INPUT field.
    }
    
    
    
    // Append a textarea element to the node to store the node's code content.
    n.append("<div class='nodecomp'><pre class='txt' contenteditable='true' spellcheck='false' /></pre></div>");
    var txt = $(".node .txt").last();
     // Style the text in the node's textarea element
   txt.css("position","absolute");
   
    txt.css({"width" : nodeWidth - 5,
             "height" : nodeHeight - bar.height() - myinput.height() - 15,
             "resize" : "none", "overflow" : "scroll",
             "font-size" : "10px" , "font-family" : "sans-serif",
             "border" : "solid 1px black","z-index":4});
          
    this.txt = txt;
    
    
    // Declare function, method to set node's contents
    this.setNodeContents = function(myContents) {
      this.txt.text(myContents);
    }
   
    // Append a resizer element to the node
    n.append("<div class='resizer' />");
    var resizer = $(".node .resizer").last();
    
    resizer.css({"position" : "absolute" , "z-index" : 10,
                 "width" : "5px", "height" : "5px", // was 10px and 10px
                 "left" : nodeWidth - 6, "top" : nodeHeight - 6, // was 11px and 11px
                 "background-color" : "white", "font-size" : "1px",
                 "border" : "1px solid gray",
                 "cursor" : "pointer"});
    
    // Append directional elements to the node
    n.append("<div class='left'>");
    n.append("<div class='top'>");
    n.append("<div class='right'>");
    n.append("<div class='bottom'>");
    
    var left = $(".node .left").last();
    // Style the left element on the node
    left.css("left","-11px");
    
    var top = $(".node .top").last();
    // Style the top element on the node
    top.css("top","-11px");
    
    var right = $(".node .right").last();
    var bottom = $(".node .bottom").last();
    
    setupConnection(left);
    setupConnection(right);
    setupConnection(top);
    setupConnection(bottom);
    
    positionLeft();
    positionRight();
    positionTop();
    positionBottom();
    
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    
    function positionLeft(){
      left.css("top", n.height() / 2 - 5);
    }
    function positionRight(){
      right.css("left",n.width() + 1).css("top", n.height() / 2 - 5);
    }
    function positionTop(){
      top.css("left", n.width() / 2 - 5);
    }
    function positionBottom(){
      bottom.css("top",n.height() + 1).css("left", n.width() / 2 - 5);
    }
    
    function setupConnection(div){
      div.css({"position" : "absolute", "width" : "10px", "padding":0,
               "height" : "10px", "background-color" : "#aaaaaa",
               "font-size" : "1px", "cursor" : "pointer"});
    }
    
    this.connectionPos = function(conn){
      var loc = conn.position();
      var nLoc = n.position();
      var point = {};
      point.x = nLoc.left + loc.left + 5;
      point.y = nLoc.top - topHeight + loc.top + 5;
      return point;
    }
    
    function updateConnections(){
       for (var i in curr.connections){
         var c = curr.connections[i];
         if (!c.removed){
           var nodeA = c.startNode.connectionPos(c.startConnection);
           var nodeB = c.endNode.connectionPos(c.endConnection);
           c.attr("path","M " + nodeA.x + " " + nodeA.y + " L " + nodeB.x + " " + nodeB.y);
            
         }
       }
    }
    this.updateConnections = updateConnections;
    
    
   function addLink(e){
      currentNode = curr;
      e.preventDefault();
      showOverlay();
      var link = paper.path("M 0 0 L 1 1");
      link.attr({"stroke-width":2});
      currentConnection = link;
      currentConnection.parent = $(this);
      
      curr.addConnection(link);
      var loc = $(this).position();
      var nLoc = n.position();
      var x = loc.left + nLoc.left + 5;
      var y = loc.top + nLoc.top - topHeight + 5;
      newNode = true;
      
      var id = setInterval(function(){
        link.attr("path","M " + x + " " + y + " L " + mouseX + " " + mouseY);
        
        pathEnd.x = mouseX;
        pathEnd.y = mouseY;
      }, 30);
      loops.push(id);
   }
   left.mousedown(addLink);
   right.mousedown(addLink);
   top.mousedown(addLink);
   bottom.mousedown(addLink);
   
   this.remove = function(){
     for (var i in curr.connections){
       var c = curr.connections[i];
       c.remove();
       delete connections[c.id];
       delete curr.connections[i];
     }
     n.remove();
     delete nodes[this.id];
   }
    
    resizer.mousedown(function(e){
      currentNode = curr;
      e.preventDefault();
      startDrag(resizer, {left : 20, top : 20, right : 500, bottom : 500},
      function(){
        var loc = resizer.position();
        var x = loc.left;
        var y = loc.top;
        n.css({"width" : x + resizer.width() - 1,
               "height" : y + resizer.height() - 1});
        
        txt.css({"width" : n.width() - 5, "height" : n.height() - bar.height() - myinput.height() - 15});
        myinput.css({"width" : n.width() - 10}); // added this line to resize nodename field.
        
        positionLeft();
        positionRight();
        positionTop();
        positionBottom();
        updateConnections();
      });
    });
    
    bar.mousedown(function(e){
      currentNode = curr;
      n.css("z-index", zindex++);
      e.preventDefault();
      startDrag(n, {left : 10, top: 40, right : win.width() - n.width() - 10, bottom : win.height() - n.height() - 10},
      updateConnections);
    });
    
    n.mouseenter(function(){
      n.css("z-index", zindex++);
    });
    
  }
  // end of function to construct a node
  
  // Declare the hit test function
  function hitTest(a, b){
    var aPos = a.position();
    var bPos = b.position();
    
    var aLeft = aPos.left;
    var aRight = aPos.left + a.width();
    var aTop = aPos.top;
    var aBottom = aPos.top + a.height();
    
    var bLeft = bPos.left;
    var bRight = bPos.left + b.width();
    var bTop = bPos.top;
    var bBottom = bPos.top + b.height();
    
    // http://tekpool.wordpress.com/2006/10/11/rectangle-intersection-determine-if-two-given-rectangles-intersect-each-other-or-not/
    return !( bLeft > aRight
      || bRight < aLeft
      || bTop > aBottom
      || bBottom < aTop
      );
  }
  
  
  // Declare the clear function
  function clear(){
    nodeId = 0;
    connectionsId = 0;
    for (var i in nodes){
      nodes[i].remove();
    }
  }
  
  // Declare the function to clear all nodes and connections
  this.clearAll = function(){
    clear();
    defaultNode();
    currentConnection = null;
    currentNode = null;
  }
  
  // Declare the function to add a node object
  this.addNode = function(x, y, w, h, noDelete){
    return new Node(x, y, w, h, noDelete);
  }
  
  var defaultWidth = 180; // originally 100.
  var defaultHeight = 80; // originally 50.
  
  // Declare function to add a node at the point of a user click
  this.addNodeAtMouse = function(){
    //alert("Zevan");
    var w = currentNode.width() || defaultWidth;
    var h = currentNode.height () || defaultHeight;
    var temp = new Node(mouseX, mouseY + 30, w, h);
    currentNode = temp;
    currentConnection = null;
  }
  
  // Declare function to set the default node
  function defaultNode(){
    
    var temp = new Node(win.width() / 2 - defaultWidth / 2, 
                        win.height() / 2 - defaultHeight / 2,
                        defaultWidth, defaultHeight, true);
    temp.txt[0].focus();
    currentNode = temp;
  }
  // Invoke function to set the default node
  defaultNode();

  // Declare function to translate node from JSON
  this.fromJSON = function(data){
    clear();
    for (var i in data.nodes){
      var n = data.nodes[i];
      var ex = (i == "0") ? true : false;
      var temp = new Node(n.x, n.y, n.width, n.height, ex, n.id);
      var addreturns = n.txt.replace(/\\n/g,'\n');
      // the above line appears to be useless, so we are writing out CRs as <BR>s.
      // therefore we need this next line to put CRs back in place upon reading in a JSON file.
      addreturns = addreturns.replace(/<br>/g,'\n');
      // the toJSON function replaces double quotes with ~~ because escaping a double quote was not working.
      addreturns = addreturns.replace(/\~~/g,'"');
     temp.txt.text(escape(addreturns));
//      temp.txt.text(n.txt);
      if (n.nodename == null) {
        temp.nodename.val(addreturns); // use txt value if nodename is null.
      } else {
        temp.nodename.val(n.nodename);
      }
    }
    for (i in data.connections){
      var c = data.connections[i];
      createConnection(nodes[c.nodeA], c.conA, nodes[c.nodeB], c.conB);
    }
  }
  
  // Declare function to translate node into JSON
  this.toJSON = function(){
    var json = '{"nodes" : [';
    for (var i in nodes){
      var n = nodes[i];
      json += '{"id" : ' + n.id + ', ';
      json += '"x" : ' + n.x() + ', ';
      json += '"y" : ' + n.y() + ', ';
      json += '"width" : ' + n.width() + ', ';
      json += '"height" : ' + n.height() + ', ';
      json += '"nodename" : "' + n.nodename.val() + '", ';
      json += '"txt" : "' + addSlashes(n.txt.html()) + '"},';
//      json += '"txt" : "' + n.txt.text() + '"},';
    }
    json = json.substr(0, json.length - 1);
    json += '], "connections" : [';
    
    var hasConnections = false;
    for (i in connections){
      var c = connections[i];
      if (!c.removed){
      json += '{"nodeA" : ' + c.startNode.id + ', ';
      json += '"nodeB" : ' + c.endNode.id + ', ';
      json += '"conA" : "' + c.startConnection.attr("class") + '", ';
      json += '"conB" : "' + c.endConnection.attr("class") + '"},';
      hasConnections = true;
      }
    }
    if (hasConnections){
      json = json.substr(0, json.length - 1);
    }
    json += ']}';
    return json;
  }
  
  // Declare function to deal with escape characters
  function addSlashes(str) {
    str = str.replace(/\\/g,'\\\\');
    str = str.replace(/\'/g,'\\\'');
//    str = str.replace(/\"/g,'\\"');
    str = str.replace(/\"/g,'\\~~');
    str = str.replace(/\0/g,'\\0');
    // CRs are automatically replace with <BR>s because of the ".html()" method on the "<pre>" element.
//    str = str.replace(/\n/g,'\\\\n'); // line feeds
//    str = str.replace(/\n/g,'\\||'); // carriage returns
    return str;
  }

}