$(function(){
  
  var graph = new NodeGraph();
  
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
  var openWin = $("#openWin");
  openWin.hide();
 
  $(".btn").mouseenter(function(){
    $(this).animate({"backgroundColor" : "white"}, 200);
  }).mouseleave(function(){
    $(this).animate({"backgroundColor" : "#efefef"});
  });
  $("#clear").click(function(){
    graph.clearAll();
  });
  $("#help").click(function(){
    window.open("http://www.zreference.com/znode", "_blank");
  });
  
  $("#save").click(saveFile);
  
  function saveFile(){
    var name = filename.val();
    if (name == "" || name == nameMessage){
      alert("Please Name Your File");
      filename[0].focus();
      return;
    }
    $.post("json/save.php", {data:graph.toJSON(), name:name}, function(data){
      alert("Your file was saved.");
    });
  }
  
  $("#canvas").mousedown(function(){
    openWin.fadeOut();
  });
  
  $("#open").click(function(){
    var fileList =  $("#files");
    fileList.html("<div>loading...<\/div>");
    openWin.fadeIn();
    fileList.load("json/files.php?"+Math.random()*1000000);
  });
  
  var nameMessage = "Enter your file name";
  var filename = $("#filename").val(nameMessage);

  filename.focus(function(){
    if ($(this).val() == nameMessage){
      $(this).val("");
    }
  }).blur(function(){
    if ($(this).val() == ""){
      $(this).val(nameMessage);
    }
  });
  
  $("#nameForm").submit(function(e){
    e.preventDefault();
    saveFile();
  });
  
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
  
  
  
  
  
  $("#findvar").click(function(){
    var tmp = $("#varname").val();
    // NEED TO ADD IN AN ALERT IF NO MATCHES!
    var nodesfound = $("pre:contains(" + tmp + ")").parent().show().parent().css('background-color','yellow');
    parseForVariables();
    parseForFunctions();
  });

  $("#clearvar").click(function(){
    var nodesfound = $(".node").css('background-color','white');
  });

  
  $("#compviewclose").click(function(){
    $("#compview").hide();
  });
  
  
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
  
    function parseForFunctions() {
    var foundFunctions = [];
    var tmp = "function "; // looking for all strings matching 'function ';
    var varlist = $("#availableVars");  // still need to add this to index.html, etc.
    $("pre:contains(" + tmp + ")").each(function(i) {
      foundFunctions[i] = $(this).text();
      //alert($(this).text());
    });
    for (var i in foundFunctions) {
      var testString = new String;
      testString = foundFunctions[i];
      var foundOne = testString.indexOf(tmp); // returns -1 if no 'function ' found in this string.
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