---
title: Article Table of Contents
---

This document describes how the table of contents within an article is generated.

![](/images/20180702-table-of-contents.png)

For the table of contents to be generated there are two elements that are used to generate the table of contents.

## 1) The data

The data for the table of contents is generated in the Gulp task located at:

```
gulp/tasks/markdown.js
```

## 2) createToc function

Inside the markdown.js task there is a function that generates the table of content's data. This is the function called `createToc`. The function takes a single parameter, which is the markup for the document.

The function first loads up the markup using Cheerio, to allow for jQuery functions but on the server side. Once the markup is loaded, it grabs each of the heading elements with an `id` attribute. This is because our markdown converter is set up to give each heading an `id` value for anchor.

It then iterates over each heading and creates an array of objects that has the title, the id and the heading type. Once the array of table of contents elements is created, than the array is return.

### createToc call

Where the `createToc` function is called is from within a pipe that makes the data stream is made available using the `gulp-data` package. Within the block, the converted markdown is passed into the `createToc` function. What is returned is then reassigned back to the stream of data that is used to generate the document. This is because the actual rendering of the table of contents is handled in a handlebars helper.

### The markup

The markup for the table of contents is generated with the help of a handlebars helper located in:

```
src/handlebars/helpers/toc.js
```
