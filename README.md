# Templates

A template is a collection of files that Thread injects with scripts and assets in order to build your Thread story. Templates define the way that your story looks, and can also have additional features in addition to core Thread features. You can use any of Thread's default templates, download community-created templates, augment existing templates, or create your own!

## Using Templates

To use a template, all you need to do is pass the Thread command line 

## The Composition of a Template


## Creating Templates

Creating a custom template 

A template is a named folder containing a series of files and folders used to inject with story data. It should contain:

- **index.html** - The most important piece, the HTML file that will be injected into. It must contain an element with the id #passages (for now).
- app/ - A folder containing all of the story-specific JavaScript code. Any .js files you put here will be included automatically.
- vendor/ - A folder containing all external assets (like jQuery, lodash, plugins, etc.). Any .js files you put in here will be included automatically.

## index.html

An **index.html** file can be any valid HTML file. The only requirements are that somewhere in your code, you have the following pieces of code in your HTML, in this order:

- `<!-- inject:vendor -->` - This will inject everything from your template's `vendor/` directory (if it exists), but will also pull in required files for Thread to run.
- `<!-- inject:passage-data -->` - This will inject the passage data from your story into the template. This is required.
- `<div id="passages"></div>` - This is the elment where your passage's actual content will be placed. This is required (for now - soon I will figure out a way to make this location customizable).
- `<!-- inject:app -->` - This is where Thread will inject all your story-specific JavaScript code if you have an `app/` folder, and will also inject Thread's required application code.