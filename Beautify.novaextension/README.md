# Beautify for Nova

Beautify integrates [JS-Beautify](https://github.com/beautify-web/js-beautify) into Nova for 
formatting Javascript, JSON, CSS, SCSS, LESS, HTML and XML. 

## Configuration

* Formatting is based on the syntax mode of the editor
* Indentation settings are inherited from the editor
* Line endings are inherited from the open document
* Other configuration options can be set as global preferences
* Option to format selection or document as specific syntax

## Invoking

* Via shortcut `⌥⇧F`
* Via menu `Editor > Beautify > Format`
* Via command palette `⌘⇧P` and then type `Format`
* Via command palette `⌘⇧P` and then type `Format as JSON`, `Format as CSS`, `Format as ...`
* Automatically formats any selected text or the whole document if there was no selection

## Known issues

* If some configuration options do not have an effect, try disabling the 'preserve existing line-breaks' option

## Screenshots

![](https://github.com/patrickvuarnoz/nova-beautify/raw/master/screenshots/screenshot.png)

