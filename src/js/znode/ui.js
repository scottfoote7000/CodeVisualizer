// This function runs on loading the script
$(function(){
  
  // Start by creating a new NodeGraph object
  var graph = new NodeGraph();
  
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
  
  // Declare the saveFile function
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

  // Declare the filename.focus function
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
  $(".file").live('click', function() {
    var name = $(this).text();
    $.getJSON("files/" + name + ".json", {n:Math.random()}, function(data){
       graph.fromJSON(data);
       
       filename.val(name);
    });
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  
  
  
  // Add the click event handler to the findvar element  
  $("#findvar").click(function(){
    var tmp = $("#varname").val();
    // NEED TO ADD IN AN ALERT IF NO MATCHES!
    // Highlight the parent element if a string match is found
    var nodesfound = $("pre:contains(" + tmp + ")").parent().show().parent().css('background-color','yellow');
    parseForVariables();
    parseForFunctions();
  });

  // Add the click event handler for the clear button element
  $("#clearvar").click(function(){
    // Put all element backgrounds back to white
    var nodesfound = $(".node").css('background-color','white');
  });

  // Add the click event handler to the compviewclose element
  $("#compviewclose").click(function(){
    // hide the compview element
    $("#compview").hide();
  });
  
  // Declare the function to search for variables
  function parseForVariables() {
    var foundVariables = [];
    var foundVars = 0; // index for foundVariables array.
    var tmp = "var "; // looking for all strings matching 'var ';
    var varlist = $("#availableVars");
    $("pre:contains(" + tmp + ")").each(function(i) {
      foundVariables[i] = $(this).text();
      //alert($(this).text());
    });
    for (var i in foundVariables) {
      var testString = new String;
      testString = foundVariables[i];
      var foundOne = testString.indexOf(tmp); // returns -1 if no 'var ' found in this string.
      while (foundOne != -1) {
        testString = testString.substring(foundOne+4); // strip off leading part of string up to first 'var ' occurance.
        foundVars = foundVars + 1;
        var foundString = new String;
        foundString = testString.substring(0,testString.indexOf(';')); // get all characters up to the next ";"
        //alert(foundString);
        testString = testString.substring(testString.indexOf(';')); // strips off leading part of string for next iteration.
        if (foundString.indexOf('=') != -1){ // if there's an '=' sign, strip that off.
          foundString = foundString.substring(0,foundString.indexOf('=')-1);
        }
        //alert(foundString);
        foundVarArray = foundString.split(','); // split into an array in case there are multiple vars declared.
        for (var x in foundVarArray) {
          varlist.append("<option value='" + foundVarArray[x] + "'>" + foundVarArray[x] + "</option>");
          //alert('writing ' + foundVarArray[x]);
          //foundVariables[i] = foundVarArray[x].trim();
          foundVars = foundVars + 1; // don't think we'll need this though.
        }
        foundOne = testString.indexOf(tmp); // look for the next occurance.
      }
    }
    //alert(foundVariables + ' ' + foundVars);
  }
  
  // Declare the function to search for functions
    function parseForFunctions() {
    var foundFunctions = [];
    var tmp = "function "; // looking for all strings matching 'function ';
    var varlist = $("#availableVars");  // still need to add this to index.html, etc.
    $("pre:contains(" + tmp + ")").each(function(i) {
      foundFunctions[i] = $(this).text();
      //alert($(this).text());
    });
    for (var i in foundFunctions) {
      // Create a new object to hold the list of functions found
      var testString = new String;
      // setup an array to hold the list
      testString = foundFunctions[i];
      var foundOne = testString.indexOf(tmp); // returns -1 if no 'function ' found in this string.
      // Loop through content, putting each new reference to the function into the array
      while (foundOne != -1) {
        testString = testString.substring(foundOne+9); // strip off leading part of string up to first 'function ' occurance.
        var foundString = new String;
        foundString = testString.substring(0,testString.indexOf('(')); // get all characters up to the next "("
        //alert(foundString);
        testString = testString.substring(testString.indexOf('(')); // strips off leading part of string for next iteration.
        varlist.append("<option value='" + foundString + "'>" + foundString + "</option>");
        foundOne = testString.indexOf(tmp); // look for the next occurance.
      }
    }
    //alert(foundVariables + ' ' + foundVars);
  }

  
});