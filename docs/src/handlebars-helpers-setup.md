---
title: Handlebars Helpers
---


This document describes how the [handlebars](https://handlebarsjs.com/) helpers are setup within the Glyder package.


## Helpers Directory

Within the Glyder package, the helpers live in:

```
glyder/handlebars/helpers
```

This is where all the handlebars helpers source files live. They are all defined in JavaScript files as functions and are exported as modules.


## Configuration

Configuration for Handlebars, like other configuration for the Glyder gulp tasks lives in:

```
glyder/gulp/config.js
```

Here helper modules are defined as key-value pairs on the object `config.handlebars.options.helpers`.


## Layouts and Partials


You'll also find directires for layouts and partials in the handlebars directory:

```
glyder/handlebars/layouts
glyder/handlebars/partials
```

Once the helpers are defined they can be used in any handlebar file found in the `layouts` or `partials` directories.
