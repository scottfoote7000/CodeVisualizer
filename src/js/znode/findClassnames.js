function findClassnames() {
  var foundClassnames = new Array();
  var foundClasses = 0; // index for foundClassnames array.
  // THESE NEXT THREE ARRAYS ARE DECLARED GLOBALLY IN index.html FILE.
  //var classnamesArray = new Array();
  //var functionsArray = new Array();
  //var variablesArray = new Array();
  var superClassname = new String;
  var nodeNumber = null;
  var j = 0; // classnameArray counter.
  var k = 0; // functionsArray counter.
  var m = 0; // variablesArray counter.
  var tmp = "function "; // looking for all lines beginning with 'function ';
  var classlist = $("#availableClasses");
  var classcomplist = $("#availableClassComps");
  var functionlist = $("#availableFunctions");
  var varlist = $("#availableVariables");
//  $("pre:contains(" + tmp + ")").each(function(i) {
  $("pre").each(function(i) {
    foundClassnames[i] = new Array();
    foundClassnames[i][0] = $(this).parent().parent().attr('id');
    foundClassnames[i][1] = $(this).text();
  });
  for (var i in foundClassnames) {
    var testString = new String;
    var thisLine = new String;
    testString = foundClassnames[i][1];
    var myNodeID = foundClassnames[i][0];
    var temp = 0;
    var theClassName = new String; // broader scope than down in the while and if statements.
    
    // check to see if this file ends with a "prototype = new" assignment (capture super-class's name).
    if (testString.lastIndexOf("prototype = new") > -1) {
      superClassname = testString.substring(testString.lastIndexOf("prototype = new")+16);
      superClassname = superClassname.replace(";","");
    } else {
      superClassname = ""; // not NULL because NULLs cause logical comparision faults in javascript.
    }
    
    while (temp != -1) { // no newline on last line in file, stops loop
      // find end of this line
      var temp = testString.indexOf("\n");
      // store just this line
      thisLine = testString.substring(0,temp);
      // check to see if "function " is in this line
      if (thisLine.indexOf(tmp) == 0) { // line starts with "function " therefore this is a CLASS definition
        theClassName = thisLine.substring(9,thisLine.indexOf("(")); // find word after "function " and before "("
        classnamesArray[j] = new Array();
        // ClassName goes in first column so default "sort" works alphbetically.
        classnamesArray[j][1] = myNodeID;
        classnamesArray[j][0] = theClassName.trim(); // trim white space for later comparisons.
        classnamesArray[j][2] = superClassname.trim(); // trim white space for later comparisons.
        j = j + 1;
      }
      
      if (thisLine.indexOf("this.") > -1) {
        // this line a) defines a function/method, or b) defines a variable/object field, or c) sets a variable/object field.
        if (thisLine.indexOf("=") > thisLine.indexOf("this.")) { // if "this."..."=" then...
          // this line defines either a function/method or a variable/object field...
          var thingName = new String;
          if (thisLine.indexOf("function") > -1) {
            thingName = thisLine.substring(thisLine.indexOf("this.")+5,thisLine.indexOf("=")-1);
            // this line defines a function/method...
            functionsArray[k] = new Array();
            // FunctionName goes in first column so default "sort" works alphabetically.
            functionsArray[k][1] = myNodeID;
            functionsArray[k][0] = thingName;
            functionsArray[k][2] = theClassName;
            k = k + 1;
          } else {
            // this line defines a variable/object field...
            // NEED TO RETHINK HOW TO STRIP OUT THE VARIABLE NAMES!!!
            thingName = thisLine.substring(thisLine.indexOf("this.")+5,thisLine.indexOf("=")-1);
            variablesArray[m] = new Array();
            // VariableName goes in first column so default "sort" works alphabetically.
            variablesArray[m][1] = myNodeID;
            variablesArray[m][0] = thingName;
            variablesArray[m][2] = theClassName;
            m = m + 1;
          }
        } else {
          // this line invokes a function/method from its superclass...
        }
      } else {
        // check for a global variable definition
        if (thisLine.indexOf("var ") == 0) {
          // found a global variable
          thingName = thisLine.substring(thisLine.indexOf("var ")+4,thisLine.indexOf("=")-1);
          variablesArray[m] = new Array();
          // VariableName goes in first column so default "sort" works alphabetically.
          variablesArray[m][1] = myNodeID;
          variablesArray[m][0] = thingName;
          variablesArray[m][2] = theClassName;
          m = m + 1;
        }
      }
      testString = testString.substring(temp+1,testString.length); // strip off this line for next loop
    }
  }
  classnamesArray.sort(); // arrange the variable names alphabetically.
  functionsArray.sort(); // arrange function names alphabetically.
  variablesArray.sort(); // arrange variable names alphabetically.
  
  for (var i in classnamesArray) {
//    classlist.append("<option value='" + classnamesArray[i][0] + "'>" + classnamesArray[i][2] + " - " + classnamesArray[i][0] + "</option>");
    classlist.append("<option value='" + classnamesArray[i][1] + "'>" + classnamesArray[i][0] + "</option>");
    classcomplist.append("<option value='" + classnamesArray[i][1] + "'>" + classnamesArray[i][0] + "</option>");
  }
  // don't put duplicate function names in the SELECT box...
  var priorFunction = new String;
  priorFunction = null;
  for (var i in functionsArray) {
//    functionlist.append("<option value='" + functionsArray[i][0] + "'>" + functionsArray[i][1] + " - " + functionsArray[i][0] + "</option>");
    if (priorFunction != functionsArray[i][0]) {
      functionlist.append("<option value='" + functionsArray[i][0] + "'>" + functionsArray[i][0] + "</option>");
      priorFunction = functionsArray[i][0];
    }
  }
  // don't put duplicate variable names in the SELECT box...
  var priorVariable = new String;
  priorVariable = null;
  for (var i in variablesArray) {
    if (priorVariable != variablesArray[i][0]) {
      varlist.append("<option value='" + variablesArray[i][0] + "'>" + variablesArray[i][0] + "</option>");
      priorVariable = variablesArray[i][0];
    }
  }

}

function inheritanceView(whichNodeID) {
  // pass in the selected Classname - rather pass in the ID value, to search the global arrays.
  clearHighlights();
  // filter/populate the list of Functions for this selected Class...
  populateClassFunctions(whichNodeID);
  var whichClassName = new String();
  var whichSuperClassName = new String();
  var whichSuperNodeID = null;
  var stringsToBeHighlighted = new Array();
  var stringArrayCounter = 0;
  // show (in a tree style) all its super (only one) and sub-classes.
  if (whichNodeID != "") {
    for (var i in classnamesArray) {
      if (classnamesArray[i][1] == whichNodeID) { // index 1 is where the NodeID is stored.
        whichClassName = classnamesArray[i][0];
        whichSuperClassName = classnamesArray[i][2]; // even if it is "".
        // if there's a super-class for this class, find its name and highlight it.
        if (whichSuperClassName != "") {
          for (var i in classnamesArray) {
            if (classnamesArray[i][0] == whichSuperClassName) {
              whichSuperClassID = classnamesArray[i][1];
              document.getElementById(whichSuperClassID).style.backgroundColor = 'yellow';
            }
          }
          // highlight any calls to functions in the superclass, if one exists, within the class's own code area.
          var lastString = new String();
          lastString = "";
          for (var i in functionsArray) {
            var whichFunction = new String();
            if (functionsArray[i][1] == whichSuperClassID) { // only check for functions from the superclass...
              if (lastString != functionsArray[i][0]){ // already highlighted this one?...
  //              highlightString(whichNodeID,"this."+functionsArray[i][0]);
                stringsToBeHighlighted[stringArrayCounter] = "this." + functionsArray[i][0];
                stringArrayCounter = stringArrayCounter + 1;
                lastString = functionsArray[i][0];
              }
            }
          }
          // highlight any variables inherited from the superclass, if one exists, within the class's own code area.
          lastString = "";
          for (var i in variablesArray) {
            var whichVariable = new String();
            if (variablesArray[i][1] == whichSuperClassID) { // only check for variables from the superclass...
              if (lastString != variablesArray[i][0]){ // already highlighted this one?...
                //highlightString(whichNodeID,"this."+variablesArray[i][0]);
                stringsToBeHighlighted[stringArrayCounter] = "this." + variablesArray[i][0];
                stringArrayCounter = stringArrayCounter + 1;
                lastString = variablesArray[i][0];
              }
            }
          }
          highlightString(whichNodeID,stringsToBeHighlighted);
        }
        document.getElementById(whichNodeID).style.backgroundColor = 'yellow';
        // show the class's own source code - open the code area.
        document.getElementById("codeFor"+whichNodeID).parentNode.style.display = 'auto'; // this ID a sub-DIV in the node DIV.
      }
    }
    // if there are sub-classes for this class, find them and highlight them.
    for (var i in classnamesArray) {
      if (classnamesArray[i][2] == whichClassName) {
  //      alert(classnamesArray[i][0]);
        document.getElementById(classnamesArray[i][1]).style.backgroundColor = 'yellow';
      }
    }
  }
}

function highlightString(thisNodeID, theseStrings) {
  if (theseStrings.length > 0) {
    var thisElement = $("#codeFor" + thisNodeID + "").each(function() {
      var temp = new String;
      temp = $(this).text();
      for (var i in theseStrings) {
        if (temp.indexOf(theseStrings[i]) > -1) { // string is in here
          //var nextCharacter = new String;
          //nextCharacter = temp.charAt(temp.indexOf(theseStrings[i])+theseStrings[i].length);
          //if (nextCharacter == " " || nextCharacter == "(" || nextCharacter == "," || nextCharacter == ")" || nextCharacter == "=") {
            var regex = new RegExp('\\b' + theseStrings[i] + '\\b', "g");
            temp = temp.replace(regex,"<span style='background-color:yellow'>" + theseStrings[i] + "</span>");
          //}
        }
      }
      $(this).html(temp);
      $(this).parent().show();
      $(this).parent().parent().css('background-color','yellow');
    });
  }
}

function populateClassFunctions(whichClassID) {
  // whichClassID is a NodeID, used as the index in the classnamesArray and functionsArray.
  var functionlist = $("#classFunctions");
  // clean out the existing SELECT except for its first OPTION...
  document.getElementById("classFunctions").options.length = 0; // clears out all the existing options...
  functionlist.append("<option value=''>Clear selection...</option>");
  for (var i in functionsArray) {
    if (functionsArray[i][1] == whichClassID) {
      functionlist.append("<option value='" + functionsArray[i][0] + "'>" + functionsArray[i][0] + "</option>");
    }
  }
}

function compositionView(whichClassID) {
  // pass in the selected Classname - rather pass in the ID value, to search the global arrays.
  clearHighlights();
  var whichClassName = new String();
  var stringsToBeHighlighted = new Array();
  var stringArrayCounter = 0;
  if (whichClassID != "") {
    // highlight the selected class's node
    document.getElementById(whichClassID).style.backgroundColor = 'yellow';
    // show the class's own source code - open the code area.
    document.getElementById("codeFor"+whichClassID).parentNode.style.display = 'auto'; // this ID a sub-DIV in the node DIV.
    // search for all nodes that contain a "new Classname" string.
    // first go get the Classname...
    for (var i in classnamesArray) {
      if (classnamesArray[i][1] == whichClassID) { // index 1 is where the NodeID is stored.
        whichClassName = classnamesArray[i][0];
        stringsToBeHighlighted[stringArrayCounter] = whichClassName; // so that it is highlighted too.
        stringArrayCounter = stringArrayCounter + 1;
      }
    }
    // highlight any calls to functions in this class...
    for (var i in functionsArray) {
      var whichFunction = new String();
      if (functionsArray[i][1] == whichClassID) { // only check for functions from this class...
        stringsToBeHighlighted[stringArrayCounter] = functionsArray[i][0];
        stringArrayCounter = stringArrayCounter + 1;
      }
    }
    // highlight any references to variables from this class...
    for (var i in variablesArray) {
      var whichVariable = new String();
      if (variablesArray[i][1] == whichClassID) { // only check for variables from the superclass...
        stringsToBeHighlighted[stringArrayCounter] = variablesArray[i][0];
        stringArrayCounter = stringArrayCounter + 1;
      }
    }
    highlightComposition(whichClassName, whichClassID, stringsToBeHighlighted);
  }
  // if found...
  //    highlight that node
  //    highlight the "new" statement
  //    process the node's code, highlighting all function calls and variables to that "new Classname" object
  //    just use the arrays to figure out which functions and variables to highlight.
}

function highlightComposition(thisClassName, thisClassID, theseStrings) {
  if (theseStrings.length > 0) {
    var whichString = "new " + thisClassName; // indicated this code "includes this class by composition".
    var thisElement = $("pre:contains(" + whichString + ")").each(function() {
      var temp = new String;
      temp = $(this).text();
//      if ($(this).attr(id) != "codeFor" + thisClassID) { // skip highlighting in the selected class's own code.
        for (var i in theseStrings) {
//          if (temp.indexOf(theseStrings[i]) > -1) { // string is in here
            var regex = new RegExp('\\b' + theseStrings[i] + '\\b', "g");
            temp = temp.replace(regex,"<span style='background-color:yellow'>" + theseStrings[i] + "</span>");
//          }
        }
//      }
      $(this).html(temp);
      $(this).parent().show();
      $(this).parent().parent().css('background-color','yellow');
    });
  }
}