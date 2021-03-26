// Require js-beautify
const beautifier = require('../Vendor/js-beautify/beautifier.min.js');



// Config options that are being read
const configJs = [
  'brace_style', 
  'brace_style_preserve_inline', 
  'space_in_paren',
  'space_in_empty_paren',
  'space_after_anon_function',
  'space_after_named_function',
  'space_before_conditional',
  'unindent_chained_methods',
  'break_chained_methods',
  'unescape_strings',
  'comma_first',
  'keep_array_indentation',
  'preserve_newlines',
];
const configCss = [
  'brace_style', 
  'selector_separator_newline', 
  'newline_between_rules',
  'preserve_newlines',
  'space_around_combinator',
];
const configHtml = [
  'brace_style',
  'wrap_attributes',
  'wrap_attributes_indent_size',
  'indent_scripts',
  'indent_inner_html',
  'preserve_newlines',
  'unformatted',
  'content_unformatted',
  'extra_liners',
];



// Do work when the extension is activated
exports.activate = function () {
  
}



// Clean up state before the extension is deactivated
exports.deactivate = function () {
  
}



// Beautify the current selection
exports.beautify = function (editor, ranges, syntax) {
  editor.edit(function (e) {
    
    // Init base options
    var options = {
      indent_char: editor.tabText.charAt(0),
      indent_size: editor.tabLength,
      indent_with_tabs: !!!editor.softTabs,
      eol: editor.document.eol,
    };
    syntax  = syntax ? syntax : editor.document.syntax;
    
    // Switch by syntax
    switch (syntax) {
      case 'typescript':
      case 'javascript':
      case 'json':
        for (option of configJs) {
          options[option] = nova.config.get('patrickvuarnoz.beautify.js.' + option);
          options[option] = (typeof options[option] == 'string')?(options[option].toLowerCase()):(options[option]);
        }
        if (options.brace_style_preserve_inline) {
          options.brace_style += ',preserve-inline'; 
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
          options[option] = (typeof options[option] == 'string')?(options[option].toLowerCase()):(options[option]);
        }
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
          options[option] = (typeof options[option] == 'string')?(options[option].toLowerCase()):(options[option]);
        }
        options.wrap_line_length = 0;
        options.wrap_attributes_indent_size = options.wrap_attributes_indent_size ? options.indent_size : 0;
        for (var range of ranges) {
          var text = editor.getTextInRange(range);
          var beautified = beautifier.html(text, options);
          e.replace(range, beautified);
        }
        break;
    }
    
    // Output options (for debugging)
    console.log('Options used for formatting ' + syntax + ':\n' + JSON.stringify(options, null, '\t'));
  });
  
  // Reset all ranges
  editor.selectedRanges = [new Range(0, 0)];
}



// Invoked by the 'format' command
nova.commands.register('beautify.format', (editor) => {
  var ranges = editor.selectedRange.length ? editor.selectedRanges.reverse() : [new Range(0, editor.document.length)];
  exports.beautify(editor, ranges, null);
});



// Invoked by the 'format selection' command
nova.commands.register('beautify.formatSelection', (editor) => {
  exports.beautify(editor, editor.selectedRanges.reverse());
});



// Invoked by the 'format as js' command, automatically takes selected ranges 
// (if the first range is not empty) and if not format the whole document
nova.commands.register('beautify.formatAsJs', (editor) => {
  var syntax = 'javascript';
  var ranges = editor.selectedRange.length ? editor.selectedRanges.reverse() : [new Range(0, editor.document.length)];
  exports.beautify(editor, ranges, syntax);
});



// Invoked by the 'format as css' command, automatically takes selected ranges 
// (if the first range is not empty) and if not format the whole document
nova.commands.register('beautify.formatAsCss', (editor) => {
  var syntax = 'css';
  var ranges = editor.selectedRange.length ? editor.selectedRanges.reverse() : [new Range(0, editor.document.length)];
  exports.beautify(editor, ranges, syntax);
});



// Invoked by the 'format as html' command, automatically takes selected ranges 
// (if the first range is not empty) and if not format the whole document
nova.commands.register('beautify.formatAsHtml', (editor) => {
  var syntax = 'html';
  var ranges = editor.selectedRange.length ? editor.selectedRanges.reverse() : [new Range(0, editor.document.length)];
  exports.beautify(editor, ranges, syntax);
});

