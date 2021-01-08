// Require js-beautify
const beautifier = require('../Vendor/beautifier.min.js');



// Config options that are being read
const configjs = [];
const configCss = ['brace_style', 'selector_separator_newline', 'newline_between_rules'];
const configHtml = [];



// Do work when the extension is activated
exports.activate = function () {
  
}



// Clean up state before the extension is deactivated
exports.deactivate = function () {
  
}



// Beautify the current selection
exports.beautify = function (editor, ranges) {
  editor.edit(function (e) {

    var syntax  = editor.document.syntax;
    var options = {
      indent_char: editor.tabText.charAt(0),
      indent_size: editor.tabLength,
      indent_with_tabs: !!!editor.softTabs,
      eol: editor.document.eol,
    };
    
    switch (syntax) {
      case 'javascript':
      case 'json':
        for (option of configJs) {
          options[option] = nova.config.get('patrickvuarnoz.beautify.js.' + option);
        }
        for (var range of ranges) {
          var text = editor.getTextInRange(range);
          var beautified = beautifier.js(text, options);
          e.replace(range, beautified);
        }
        break;
        
      case 'css':
      case 'less':
      case 'scss':
        for (option of configCss) {
          options[option] = nova.config.get('patrickvuarnoz.beautify.css.' + option);
        }
        options.preserve_newlines = false;
        for (var range of ranges) {
          var text = editor.getTextInRange(range);
          var beautified = beautifier.css(text, options);
          e.replace(range, beautified);
        }
        break;
        
      case 'html':
      case 'xml':
        for (option of configHtml) {
          options[option] = nova.config.get('patrickvuarnoz.beautify.html.' + option);
        }
        for (var range of ranges) {
          var text = editor.getTextInRange(range);
          var beautified = beautifier.html(text, options);
          e.replace(range, beautified);
        }
        break;
    }
  });
}



// Invoked by the 'format' command
nova.commands.register('beautify.format', (editor) => {
  exports.beautify(editor, [new Range(0, editor.document.length)]);
});



// Invoked by the 'format selection' command
nova.commands.register('beautify.formatSelection', (editor) => {
  exports.beautify(editor, editor.selectedRanges.reverse());
});

