// Declare the function to search for variables
function parseForVariables() {
  var foundVariables = [];
  var foundVars = 0; // index for foundVariables array.
  var variablesArray = new Array();
  var j = 0; // variableArray counter.
  var tmp = "var "; // looking for all strings matching 'var ';
  var varlist = $("#availableVars");
  $("pre:contains(" + tmp + ")").each(function(i) {
    foundVariables[i] = $(this).text();
  });
  for (var i in foundVariables) {
    var testString = new String;
    testString = foundVariables[i];
    var foundOne = testString.indexOf(tmp); // returns -1 if no 'var ' found in this string.
    while (foundOne != -1) {
      var isForLoop = (testString.charAt(foundOne-1)) == '(' ? 1 : 0; // if there's a '(var' then skip this "for loop" var.
      testString = testString.substring(foundOne+4); // strip off leading part of string up to first 'var ' occurance.
      if (!isForLoop) { // ignore "for (var..." variables.
        foundVars = foundVars + 1;
        var foundString = new String;
        foundString = testString.substring(0,testString.indexOf(';')); // get all characters up to the next ";"
//        testString = testString.substring(testString.indexOf(';')); // strips off leading part of string for next iteration.
        if (foundString.indexOf('=') != -1){ // if there's an '=' sign, strip that off.
          foundString = foundString.substring(0,foundString.indexOf('=')-1);
        }
        foundVarArray = foundString.split(','); // split into an array in case there are multiple vars declared.
        for (var x in foundVarArray) {
          var trimmedString = foundVarArray[x].trim();
          if (trimmedString.indexOf(' ') == -1) { // variables found in comments end up with spaces around them.
            var foundAlready = false;
            for (var k in variablesArray) {
                if (variablesArray[k] == trimmedString) {
                    foundAlready = true;
                }
            }
            if (!foundAlready) {
                variablesArray[j] = trimmedString;
                j = j + 1;
            }
          }
          foundVars = foundVars + 1; // don't think we'll need this though.
        }
      }
      testString = testString.substring(testString.indexOf(';')); // strips off leading part of string for next iteration.
      foundOne = testString.indexOf(tmp); // look for the next occurance.
    }
  }
  variablesArray.sort(); // arrange the variable names alphabetically.
  for (var i in variablesArray) {
    varlist.append("<option value='" + variablesArray[i] + "'>" + variablesArray[i] + "</option>");
  }
}

// Declare the function to search for functions
function parseForFunctions() {
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
    // Create a new object to hold the list of functions found
    var testString = new String;
    // setup an array to hold the list
    testString = foundFunctions[i];
    var foundOne = testString.indexOf(tmp); // returns -1 if no 'function ' found in this string.
    // Loop through content, putting each new reference to the function into the array
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