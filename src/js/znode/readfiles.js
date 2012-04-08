// Declare the function to read a file into a new Node.
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  // Loop through the FileList and generate the Node objects.
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        var myNode = graph.addNode(200, 200, /*defaultWidth*/ 180, /*defaultHeight*/ 80, false);
        myNode.setNodeName(escape(theFile.name));
        myNode.txt.text(e.target.result);
      };
    })(f);
    reader.readAsText(f);
  }
}
