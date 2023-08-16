// Require js-beautify
const beautifier = require('../Vendor/js-beautify/beautifier-1.14.9.min.js');



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



// Registered listeners
var willSaveListeners = [];
var didAddTextEditorListener = null;



// Event handler for onDidAddTextEditor
exports.didAddTextEditor = function (editor) {
  
  if (!willSaveListeners.includes(editor)) {
    willSaveListeners.push(editor.onWillSave(exports.willSave));
  }
}



// Event handler for onWillSave
exports.willSave = function (editor) {
  
  // Get the syntax of the editor
  var syntax = editor.document.syntax;
  
  // Check format-on-save by syntax
  var formatOnSave = nova.config.get('patrickvuarnoz.beautify.format_on_save.' + syntax);
  
  // Format if on-save is activated
  if (formatOnSave) {
    exports.beautify(editor, syntax);
  }
}



// Do work when the extension is activated
exports.activate = function () {
  
  // Add listeners
  if (!didAddTextEditorListener) {
    didAddTextEditorListener = nova.workspace.onDidAddTextEditor(exports.didAddTextEditor);
  }
}



// Clean up state before the extension is deactivated
exports.deactivate = function () {
  
  // Remove listeners
  if (didAddTextEditorListener) {
    didAddTextEditorListener.dispose();
    didAddTextEditorListener = null;
  }
  
  // Remove listeners
  for (willSaveListener of willSaveListeners) {
    willSaveListener.dispose();
    willSaveListener = null;
  }
  willSaveListeners = [];
}



// Beautify the current selection
exports.beautify = function (editor, syntax) {
  
  // Perform the edit
  editor.edit(function (e) {
    
    // Init base options
    var formatter = null;
    var options = {
      indent_char: editor.tabText.charAt(0),
      indent_size: editor.tabLength,
      indent_with_tabs: !!!editor.softTabs,
      eol: editor.document.eol,
    };
    syntax  = syntax ? syntax : editor.document.syntax;
    
    // Switch by syntax, set options and formatter
    switch (syntax) {
      case 'javascript':
      case 'typescript':
      case 'json':
        for (option of configJs) {
          options[option] = nova.config.get('patrickvuarnoz.beautify.js.' + option);
          options[option] = (typeof options[option] == 'string')?(options[option].toLowerCase()):(options[option]);
        }
        if (options.brace_style_preserve_inline) {
          options.brace_style += ',preserve-inline';
        }
        formatter = 'js';
        break;
        
      case 'css':
      case 'scss':
      case 'less':
      case 'liquid-css':
      case 'liquid-scss':
        for (option of configCss) {
          options[option] = nova.config.get('patrickvuarnoz.beautify.css.' + option);
          options[option] = (typeof options[option] == 'string')?(options[option].toLowerCase()):(options[option]);
        }
        formatter = 'css';
        break;
        
      case 'html':
      case 'xml':
      case 'html+ejs':
      case 'html+erb':
      case 'jinja-html':
      case 'liquid-html':
        for (option of configHtml) {
          options[option] = nova.config.get('patrickvuarnoz.beautify.html.' + option);
          options[option] = (typeof options[option] == 'string')?(options[option].toLowerCase()):(options[option]);
        }
        options.wrap_line_length = 0;
        options.wrap_attributes_indent_size = options.wrap_attributes_indent_size ? options.indent_size : 0;
        formatter = 'html';
        break;
    }
    
    // Check if we got a formatter
    if (formatter) {
      
      // If we have ranges we can simply beautify all the ranges from bottom to
      // top end then exit. Selected ranges can remain as is. Attention, use
      // 'selectedRange' here and not 'selectedRanges'.
      if (editor.selectedRange.length) {
        
        // Fetch the ranges and reverse them
        var ranges = editor.selectedRanges.reverse();
        
        // Loop over ranges and beautify them
        for (var range of ranges) {
          e.replace(range, beautifier[formatter](editor.getTextInRange(range), options));
        }
        
      // If we don't have ranges we have to store and restore the cursor
      // position so that after beautify the user can type along from
      // where he left off.
      } else {
        
        // Get full text and the current cursor
        var range = new Range(0, editor.document.length);
        var text = editor.getTextInRange(range);
        var cursor = editor.selectedRange.end;
        var marker = String.fromCharCode(0xFFFFF);
        
        // Add marker to text, beautify and find new cursor position
        var textWithMarker = text.slice(0, cursor) + marker + text.slice(cursor + marker.length);
        var beautifiedWithMarker = beautifier[formatter](textWithMarker, options);
        var newCursor = beautifiedWithMarker.indexOf(marker);
        
        // Beautify original text
        e.replace(range, beautifier[formatter](text, options));
        
        // Set cursor at new position. We have to use insert() here since
        // setting the selected range on the editor itself would add
        // an additional undo state.
        if (newCursor != -1) {
          e.insert(newCursor, '');
        } else {
          e.insert(0, '');
        }
      }
    }
    
    // Output options (for debugging)
    console.log('Options used for formatting ' + syntax + ':\n' + JSON.stringify(options, null, '\t'));
  });
}



// Invoked by the 'format' command
nova.commands.register('beautify.format', (editor) => {
  exports.beautify(editor);
});



// Invoked by the 'format as js' command, automatically takes selected ranges
// (if the first range is not empty) and if not format the whole document
nova.commands.register('beautify.formatAsJs', (editor) => {
  exports.beautify(editor, 'javascript');
});



// Invoked by the 'format as css' command, automatically takes selected ranges
// (if the first range is not empty) and if not format the whole document
nova.commands.register('beautify.formatAsCss', (editor) => {
  exports.beautify(editor, 'css');
});



// Invoked by the 'format as html' command, automatically takes selected ranges
// (if the first range is not empty) and if not format the whole document
nova.commands.register('beautify.formatAsHtml', (editor) => {
  exports.beautify(editor, 'html');
});

