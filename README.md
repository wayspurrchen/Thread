# TEMPLATE SPECIFICATION

A template is a named folder containing a series of files and folders used to inject with story data. It should contain:

- **index.html** - The most important piece, the HTML file that will be injected into. It must contain an element with the id #passages (for now).
- lib/ - A folder containing all of the story-specific JavaScript code. Any .js files you put here will be included automatically.
- vendor/ - A folder containing all external assets (like jQuery, lodash, plugins, etc.). Any .js files you put in here will be included automatically.

## index.html

An **index.html** file can be any valid HTML file. The only requirements are that somewhere in your code, you have the following pieces of code in your HTML, in this order:

- `<!-- inject:vendor -->` - This will inject everything from your template's `vendor/` directory (if it exists), but will also pull in required files for Thread to run.
- `<!-- inject:passage-data -->` - This will inject the 
- `<div id="passages"></div>`
- `<!-- inject:app -->`