// Require js-beautify
const beautifier = require('../Vendor/beautifier.min.js');



// Do work when the extension is activated
exports.activate = function () {
  
}



// Clean up state before the extension is deactivated
exports.deactivate = function () {
  
}



// Beautify the current selection
exports.beautify = function (editor, ranges) {

  var syntax  = editor.document.syntax;
  var options = {
    indent_char: editor.tabText.charAt(0),
    indent_size: editor.tabLength,
    indent_with_tabs: !!!editor.softTabs,
  };
  
  editor.edit(function (e) {
    for (var range of ranges) {
      var text = editor.getTextInRange(range);
      var beautified = '';
      
      switch (syntax) {
        case "javascript":
        case "json":
          beautified = beautifier.js(text, options);
          break;
          
        case "css":
        case "less":
        case "scss":
          beautified = beautifier.css(text, options);
          break;
          
        case "html":
        case "xml":
        case "svg":
          beautified = beautifier.html(text, options);
          break;
          
        default:
          beautified = text;
          break;  
      }

      e.replace(range, beautified);
    }
  });
}



// Invoked by the "format" command
nova.commands.register("beautify.format", (editor) => {
  exports.beautify(editor, [new Range(0, editor.document.length)]);
  //editor.scrollToPosition(0);
});



// Invoked by the "format selection" command
nova.commands.register("beautify.formatSelection", (editor) => {
  exports.beautify(editor, editor.selectedRanges.reverse());
});

