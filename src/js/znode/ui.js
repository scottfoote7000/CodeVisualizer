$(function(){
  
//  var graph = new NodeGraph();
  graph = new NodeGraph();  // declared in script portion of index.html
  
  // we commented this out - and moved the "add node" up to a menu button.
  // consider moving to NodeGraph
  //$("#canvas").mouseup(function(e){
  //   if (openWin.css("display") == "none"){
  //     var children = $(e.target).children();
  //     if (children.length > 0){
  //       var type = children[0].tagName;
  //       if (type == "desc" || type == "SPAN"){
  //         graph.addNodeAtMouse();
  //       }
  //     }
  //   }
  //});
  
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
    document.getElementById('availableClasses').options.length = 1;
    document.getElementById('classFunctions').options.length = 1;
    document.getElementById('availableClassComps').options.length = 1;
    document.getElementById('availableFunctions').options.length = 1;
    document.getElementById('availableVariables').options.length = 1;
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
    openWin.fadeOut(); // closes openWin...
    $.getJSON("files/" + name + ".json", {n:Math.random()}, function(data){
       graph.fromJSON(data);
       
       filename.val(name);
    });
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  
  
  $("#addnode").click(function(){
    graph.addNodeAtMouse();
  });


// COMMENTED OUT THE findvar BUTTON AND FUNCTION - NO LONGER NECESSARY.  
//  $("#findvar").click(function(){
//    //var tmp = $("#varname").val();
//    // NEED TO ADD IN AN ALERT IF NO MATCHES!
//    //var nodesfound = $("pre:contains(" + tmp + ")").parent().show().parent().css('background-color','yellow');
////    parseForVariables();
////    parseForFunctions();
//    findClassnames();
//    $("#compview").show();
//  });
  
  $("#clearvar").click(function(){
    clearHighlights();
  });

  $("#compviewclose").click(function(){
    $("#compview").hide();
  });
  
  $("#compviewheader").click(function(){
    $("#compviewselections").slideToggle();
  });
});