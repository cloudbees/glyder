---
section: Components
title: Code previews
draft: true
---

Code previews are an easy way to document markup and styles within the
style guide. Code previews can contain HTML, CSS, and JavaScript and can be
fully rendered in a preview pane like this:

<example>
  <snippet type="text/html">
    <button id="okay" class="button primary-button" type="button">
      Okay
    </button>
    <button class="button" type="button">
      Cancel
    </button>
  </snippet>
  <snippet type="text/css">
    .button {
      border: 1px solid silver;
      background: #eee;
      border-radius: 18px;
      cursor: pointer;
      padding: 6px 12px 7px;
    }
    .button:focus {
      outline: none;
      border-color: #39a0d9;
    }
    .primary-button {
      background: #3498db;
      border-color: #2980b9;
      color: white;
    }
    .primary-button:focus {
      border-color: #055089;
    }
  </snippet>
  <snippet type="text/javascript">
    var primary = document.getElementById('okay');
    primary.addEventListener('click', function() {
      alert('You clicked the "Okay" button!')
    });
  </snippet>
</example>

The preview pane is rendered inside of an `iframe` so that the CSS and
JavaScript are fully sandboxed.

### An example

In the simplest case, code previews can be created with a single `example` tag
within a document like this:

<example render="false">
  <example>
    <p>Hello world!</p>
  </example>
</example>

This would render the HTML with a preview pane:

<example>
  <p>Hello world!</p>
</example>

### Including HTML, CSS, and JavaScript

There are times when you need to share more than just HTML to create an
example. To do this include multiple `snippet` tags inside of the example. (Be
sure to set the `type` attribute to the appropriate mime-type, too.)

Here's an example:

<example render="true">
  <example>
    <snippet type="text/html">
      <p>Hello world!</p>
    </snippet>
    <snippet type="text/css">
      body { color: red; }
    </snippet>
    <snippet type="text/javascript">
      console.log('Hello world!')
    </snippet>
  </example>
</example>

Which renders:

<example>
  <snippet type="text/html">
    <p>Hello world!</p>
  </snippet>
  <snippet type="text/css">
    body { color: blue; }
  </snippet>
  <snippet type="text/javascript">
    console.log('Hello world!')
  </snippet>
</example>


### No preview

There are times when it is useful to not render the preview pane. To do this,
add a `render` attribute on the `example` tag and set it to `false`:

<example render="false">
  <example render="false">
    <p>Hello world!</p>
  </example>
</example>

Which renders:

<example render="false">
  <p>Hello world!</p>
</example>


### Example types

By default, when examples are rendered without a type or child `snippet` tags,
they are considered HTML. But you can also set the type on the `example` tag if
you need to render CSS or JavaScript:

<example render="false">
  <example type="text/css" render="false">
    p { color: blue; }
  </example>
</example>

Which renders with full syntax highlighting:

<example type="text/css" render="false">
  p { color: blue; }
</example>


### Example projects

Code previews can also contain additional JavaScript and Stylesheets by
associating them with a project. This is done through the `project` attribute
on the `example` tag. Here's how you would add an example for the "Oxygen"
project:

<example render="false">
  <example project="oxygen">
    <button class="button">Button</button>
  </example>
</example>

Which renders:

<example project="oxygen">
  <button class="button">Button</button>
</example>

Projects can be configured in the `gulp` task. Edit `gulp/tasks/markdown.js` to
add or modify projects.
