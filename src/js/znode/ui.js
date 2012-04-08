// This function runs on loading the script
$(function(){
  
  // Start by creating a new NodeGraph object
  // replaced var graph = new NodeGraph();
  graph = new NodeGraph();  // declared in script portion of index.html
  
  // Add the mouseup event handler to the canvas element
  // consider moving to NodeGraph
  $("#canvas").mouseup(function(e){
     if (openWin.css("display") == "none"){
       var children = $(e.target).children();
       if (children.length > 0){
         var type = children[0].tagName;
         if (type == "desc" || type == "SPAN"){
           graph.addNodeAtMouse();
         }
       }
     }
  });
  
  // ui code

  // Setup a variable to point to the openWin element
  // that will hold the file list.... and hide that to start.
  var openWin = $("#openWin");
  openWin.hide();
 
  // Add the mouse event handler to the btn class of elements
  $(".btn").mouseenter(function(){
    $(this).animate({"backgroundColor" : "white"}, 200);
  }).mouseleave(function(){
    $(this).animate({"backgroundColor" : "#efefef"});
  });
  // Add the click event handler to the clear button element
  $("#clear").click(function(){
    graph.clearAll();
  });
  // Add the click event handler to the help button element
  $("#help").click(function(){
    window.open("http://www.zreference.com/znode", "_blank");
  });
  // Add the click event handler to the save button element
  $("#save").click(saveFile);
  
  // Define the saveFile function
  function saveFile(){
    var name = filename.val();
    if (name == "" || name == nameMessage){
      // prompt the user for a file name
      alert("Please Name Your File");
      filename[0].focus();
      return;
    }
    // save the file by invoking save.pnp, and alert the user
    $.post("json/save.php", {data:graph.toJSON(), name:name}, function(data){
      alert("Your file was saved.");
    });
  }
  
  // Add the mouse event handler to re-hide the file window
  // when the user clicks on the canvas.
  $("#canvas").mousedown(function(){
    openWin.fadeOut();
  });
  
  // Add the click event handler to the open button to open/populate the file list window
  $("#open").click(function(){
    var fileList =  $("#files");
    fileList.html("<div>loading...<\/div>");
    openWin.fadeIn();
    fileList.load("json/files.php?"+Math.random()*1000000);
  });
  
  // Define variables to prompt and receive the user's filename
  var nameMessage = "Enter your file name";
  var filename = $("#filename").val(nameMessage);

  // Define the filename.focus function
  filename.focus(function(){
    if ($(this).val() == nameMessage){
      $(this).val("");
    }
  }).blur(function(){
    if ($(this).val() == ""){
      $(this).val(nameMessage);
    }
  });
  
  // Add a submit event handler to the nameForm element
  $("#nameForm").submit(function(e){
    e.preventDefault();
    saveFile();
  });
  
  // Add the event handler to retrieve the JSON content from the user's file
  $(".file").on('click', function() {
    var name = $(this).text();
    $.getJSON("files/" + name + ".json", {n:Math.random()}, function(data){
       graph.fromJSON(data);
       
       filename.val(name);
    });
  }).on('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).on("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  
  
  
  
  // Add the click event handler to the findvar element  
  $("#findvar").click(function(){
    // var tmp = $("#varname").val();
    // NEED TO ADD IN AN ALERT IF NO MATCHES!
    // var nodesfound = $("pre:contains(" + tmp + ")").parent().show().parent().css('background-color','yellow');
    parseForVariables();
    parseForFunctions();
  });
  
  // Add the click event handler for the clear button element
  function highlightVars(whichString) {
    //var tmp = $("#varname").val();
    // NEED TO ADD IN AN ALERT IF NO MATCHES!
    clearHighlights();
    if (whichString.length > 0) {
      var nodesfound = $("pre:contains(" + whichString + ")").parent().show().parent().css('background-color','yellow');
    }
  }
  
  // Declare the function to clear the highlighted elements
  function clearHighlights() {
    var nodesfound = $(".node").css('background-color','white');    
  }

  // Add the click event handler for the clear button element
  $("#clearvar").click(function(){
    clearHighlights();
  });

  // Add the click event handler to the compviewclose element
  $("#compviewclose").click(function(){
    $("#compview").hide();
  });
    
});