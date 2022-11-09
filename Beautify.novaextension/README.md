# Beautify for Nova

Beautify integrates [JS-Beautify](https://github.com/beautify-web/js-beautify) into Nova for
formatting Javascript, Typescript, JSON, CSS, SCSS, LESS, HTML and XML.

## Configuration

* Formatting is based on the syntax mode of the editor
* Indentation settings are inherited from the editor
* Line endings are inherited from the open document
* Other configuration options can be set as global preferences
* Option to format selection or whole document as specific syntax
* Option to format on save, settable per syntax in global preferences

## Invoking

* Via shortcut `⌥⇧F`
* Via menu `Editor > Beautify > Format`
* Via command palette `⌘⇧P` and then type `Format`
* Via command palette `⌘⇧P` and then type `Format as JSON`, `Format as CSS`, `Format as ...`
* Automatically formats any selected text or the whole document if there was no selection

## Known issues

* If some configuration options do not have an effect, try disabling the `preserve existing line-breaks` and check other `preserve` options.
* If some configuration options entered into text fields are not directly used, then this is due to a bug in Nova. You have to switch to another activated extension in the extension library (i.e. loose focus on the Beautify extension) before the values get updated. You can check which configuration options are being used by checking the extension console after formatting.

## Screenshots

![](https://github.com/patrickvuarnoz/nova-beautify/raw/master/screenshots/screenshot.png)

