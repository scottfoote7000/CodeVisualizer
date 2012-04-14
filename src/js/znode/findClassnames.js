function findClassnames() {
  var foundClassnames = new Array();
  var foundClasses = 0; // index for foundClassnames array.
  var classnamesArray = new Array();
  var functionsArray = new Array();
  var variablesArray = new Array();
  var superClassname = new String;
  var nodeNumber = null;
  var j = 0; // classnameArray counter.
  var k = 0; // functionsArray counter.
  var m = 0; // variablesArray counter.
  var tmp = "function "; // looking for all lines beginning with 'function ';
  var classlist = $("#availableClasses");
  var functionlist = $("#availableFunctions");
  var varlist = $("#availableVariables");
//  $("pre:contains(" + tmp + ")").each(function(i) {
  $("pre").each(function(i) {
    foundClassnames[i] = new Array();
    foundClassnames[i][0] = $(this).parent().parent().id;
    foundClassnames[i][1] = $(this).text();
  });
  for (var i in foundClassnames) {
    var testString = new String;
    var thisLine = new String;
    testString = foundClassnames[i][1];
    var myNodeID = foundClassnames[i][0];
    var temp = 0;
    var theClassName; // broader scope than down in the while and if statements.
    while (temp != -1) { // no newline on last line in file, stops loop
      // find end of this line
      var temp = testString.indexOf("\n");
      // store just this line
      thisLine = testString.substring(0,temp);
      // check to see if "function " is in this line
      if (thisLine.indexOf(tmp) == 0) { // line starts with "function " therefore this is a CLASS definition
        theClassName = thisLine.substring(9,thisLine.indexOf("(")); // find word after "function " and before "("
        classnamesArray[j] = new Array();
        classnamesArray[j][0] = myNodeID;
        classnamesArray[j][1] = theClassName;
        j = j + 1;
      }
      
      if (thisLine.indexOf("this.") > -1) {
        // this line a) defines a function/method, or b) defines a variable/object field, or c) sets a variable/object field.
        if (thisLine.indexOf("=") > -1) {
          // this line defines either a function/method or a variable/object field...
          var thingName = new String;
          if (thisLine.indexOf("function") > -1) {
            thingName = thisLine.substring(thisLine.indexOf("this.")+5,thisLine.indexOf("=")-1);
            // this line defines a function/method...
            functionsArray[k] = new Array();
            functionsArray[k][0] = myNodeID;
            functionsArray[k][1] = thingName;
            k = k + 1;
          } else {
            // this line defines a variable/object field...
            // NEED TO RETHINK HOW TO STRIP OUT THE VARIABLE NAMES!!!
            thingName = thisLine.substring(thisLine.indexOf("this.")+5,thisLine.indexOf("=")-1);
            
            
            
            
            variablesArray[m] = new Array();
            variablesArray[m][0] = myNodeID;
            variablesArray[m][1] = thingName;
            m = m + 1;
          }
        } else {
          // this line invokes a function/method from its superclass...
        }
      }
      
      if (thisLine.indexOf("prototype = new") > -1) {
        superClassname = thisLine.substring(thisLine.indexOf("prototype = new")+16,thisLine.indexOf(";"));
        classnamesArray[j-1][2] = superClassname;
      }
      
      testString = testString.substring(temp+1,testString.length); // strip off this line for next loop
    }
  }
  classnamesArray.sort(); // arrange the variable names alphabetically.
  functionsArray.sort(); // arrange function names alphabetically.
  variablesArray.sort(); // arrange variable names alphabetically.
  
  for (var i in classnamesArray) {
    classlist.append("<option value='" + classnamesArray[i][1] + "'>" + classnamesArray[i][1] + "</option>");
  }
  for (var i in functionsArray) {
    functionlist.append("<option value='" + functionsArray[i][1] + "'>" + functionsArray[i][1] + "</option>");
  }
  for (var i in variablesArray) {
    varlist.append("<option value='" + variablesArray[i][1] + "'>" + variablesArray[i][1] + "</option>");
  }

}

function xxxxxxxxxparseForFunctions() {
  var foundFunctions = [];
  var tmp = "function "; // looking for all strings matching 'function ';
  var functionsArray = new Array();
  var j = 0; // functionsArray counter.
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
      var isAnonymousFunction = (testString.charAt(foundOne+10)) == '(' ? 1 : 0; // check if this is an anonymous function.
      testString = testString.substring(foundOne+9); // strip off leading part of string up to first 'function ' occurance.
      if (!isAnonymousFunction) {
        var foundString = new String;
        foundString = testString.substring(0,testString.indexOf('(')); // get all characters up to the next "("
        var trimmedString = foundString.trim();
        if ((trimmedString.indexOf(' ') == -1) && (trimmedString.length > 0)) { // function names won't contain spaces.
            var foundAlready = false;
            for (var k in functionsArray) {
                if (functionsArray[k] == trimmedString) {
                    foundAlready = true;
                }
            }
            if (!foundAlready) {
                functionsArray[j] = trimmedString;
                j = j + 1;
            }
//          varlist.append("<option value='" + foundString + "'>" + foundString + "</option>");
        }
      }
      testString = testString.substring(testString.indexOf('(')); // strips off leading part of string for next iteration.
      foundOne = testString.indexOf(tmp); // look for the next occurance.
    }
  }
  functionsArray.sort(); // arrange the variable names alphabetically.
  for (var i in functionsArray) {
    varlist.append("<option value='" + functionsArray[i] + "'>" + functionsArray[i] + "</option>");
  }
}