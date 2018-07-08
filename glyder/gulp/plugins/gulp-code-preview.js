var util = require('gulp-util');
var PluginError = util.PluginError;
var through = require('through2');
var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var es = require('event-stream');
var cheerio = require('cheerio');
var _ = require('lodash');

var PLUGIN_NAME = 'gulp-data-toc';

var tabNames = {
  'html': 'HTML',
  'css': 'CSS',
  'javascript': 'JavaScript'
};

var blank = /^\s*$/m;


function CodePreview(config) {
  this.setConfig(config);
  this.examples = [];
}

CodePreview.prototype.setConfig = function(config) {
   this.config = _.extend({
    directory: 'previews',
    baseUrl: '/previews',
    projects: []
  }, config);
  this.setProjects(this.config.projects);
  return this.config;
};

CodePreview.prototype.setProjects = function(projects) {
  var object = {};
  projects.forEach(function(project) {
    object[project.name] = new Project(project);
  });
  this.projects = object;
  return this.projects;
};

CodePreview.prototype.extract = function() {
  var preview = this;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    var $ = cheerio.load(file.contents.toString(), {decodeEntities: false});

    $('example').each(function(i, el) {
      var $el = $(el);

      // Skip if nested inside another example
      if ($el.parents('example').length) { return; }

      var $els = $el.find('> snippet')
      ,   project = preview.projects[$el.attr('project')]
      ,   render = $el.attr('render') ? bool($el.attr(render)) : null
      ,   example = new Example(project, render, preview.config)
      ;

      if (!$els.length) {
        $els = $els.add($el); // Implicit snippet
      }

      $els.each(function(i, el) {
        var $el = $(el)
        ,   mimeType = $el.attr('type')
        ,   code = isMimeTypeHtml(mimeType) ? $el.html() : $el.text()
        ;
        example.snippets.push(new Snippet(code, mimeType));
      });

      $el.replaceWith(example.toPlaceholder());

      preview.examples.push(example);
    });


    file.contents = new Buffer($.html());

    return cb(null, file);
  });
};

CodePreview.prototype.write = function() {
  var preview = this;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    var $ = cheerio.load(file.contents.toString(), {decodeEntities: false});

    $('[data-example-placeholder]').each(function(i, el) {
      var $el = $(el)
      ,   id = $el.attr('data-example-placeholder')
      ,   example = _.find(preview.examples, {id: id})
      ;
      $el.replaceWith(example.toPreview());
    });

    file.contents = new Buffer(normalizeHtml($.html()));

    return cb(null, file);
  });
};

CodePreview.prototype.files = function() {
  var streams = [];

  this.examples.forEach(function(example) {
    var filename = example.filename()
    ,   stream = source(filename)
    ,   streamEnd = stream
    ;
    stream.write(example.toHtml());

    // In the next process cycle, end the stream
    process.nextTick(function() { stream.end(); });

    // Turn the contents into a vinyl buffer
    streamEnd = streamEnd.pipe(vinylBuffer());

    streams.push(streamEnd);
  });

  return es.merge.apply(this, streams);
};


function Snippet(code, mimeType) {
  this.code = normalizeIndent(code);
  this.mimeType = (mimeType || 'text/html').trim();
}

Snippet.prototype.name = function() {
  var pairs = this.mimeType.split('/', 2)
  ,   subtype = '' + pairs[1]
  ,   lookup = tabNames[subtype.toLowerCase()]
  ,   name
  ;
  if (lookup) {
    name = lookup;
  } else {
    name = subtype.charAt(0).toUpperCase() + subtype.slice(1);
  }
  return name;
};


let exampleCount = 0;

function Example(project, render, config) {
  this.project = project;
  this.render = typeof(render) === 'boolean' ? render : true;
  this.config = config;
  this.snippets = [];
  this.id = String(exampleCount += 1);
};

Example.prototype.filename = function() {
  return `${this.config.directory}/example-${this.id}.html`;
};

Example.prototype.url = function() {
  return `${this.config.baseUrl}/example-${this.id}.html`;
};

Example.prototype.renderable = function() {
  return this.render && _.some(this.snippets, {mimeType: 'text/html'});
};

// HTML to temporarily mark where the preview should be inserted
Example.prototype.toPlaceholder = function() {
  var adapter = new PlaceholderAdapter(this);
  return adapter.toString();
};

// HTML to embed in the preview
Example.prototype.toPreview = function() {
  var adapter = new PreviewAdapter(this);
  return adapter.toString();
};

// HTML for iFrame
Example.prototype.toHtml = function() {
  var adapter = new HtmlAdapter(this);
  return adapter.toString();
};


function PlaceholderAdapter(example) {
  this.example = example;
}

PlaceholderAdapter.prototype.toString = function() {
  return `<div data-example-placeholder="${ this.example.id }"></div>`;
};


function PreviewAdapter(example) {
  this.example = example;
}

PreviewAdapter.prototype.toString = function() {
  return '<div class="code-preview">' + this.tabs() + this.content() + '</div>';
};

PreviewAdapter.prototype.tabs = function() {
  var snippets = this.example.snippets
  ,   renderable = this.example.renderable()
  ,   tabs = []
  ;
  if (renderable) {
    tabs.push(`<span class="code-preview-tab is-selected">Preview</span>`);
  }
  if (renderable || snippets.length > 1) {
    snippets.forEach(function(snippet, i) {
      var selected = renderable ? '' : (i === 0 ? ' is-selected' : '');
      tabs.push(`<span class="code-preview-tab">${ snippet.name() }</span>`);
    });
  }
  return tabs.length ? `<div class="code-preview-tabs">${ tabs.join('') }</div>` : '';
};

PreviewAdapter.prototype.content = function() {
  var snippets = this.example.snippets
  ,   renderable = this.example.renderable() ? 1 : 0
  ,   content = []
  ;
  if (renderable) {
    content.push(`<iframe class="code-preview-content" src="${ this.example.url() }"></iframe>`);
  }
  snippets.forEach(function(snippet) {
    var isHidden = this.tabs.length + renderable ? ' is-hidden' : '';
    var code = escape(snippet.code);
    content.push(`<div class="code-preview-content${ isHidden }" data-mime-type="${ snippet.mimeType }"><pre>${ code }</pre></div>`);
  });
  return content.join('');
};


function HtmlAdapter(example) {
  this.example = example;
  this.snippets =  _.groupBy(example.snippets, 'mimeType');
}

HtmlAdapter.prototype.toString = function() {
  return (
    '<!doctype html>' +
    '<html>' +
      '<head>' +
        '<meta charset="utf-8">' +
        `<title>Example ${ this.example.id }</title>` +
        this.styles() +
      '</head>' +
      `<body${this.ngApp()} style="padding: 0px; margin: 10px">` +
        this.body() + ' ' +
        '<script>UV={};UV.AngularBootstrap={};UV.angularLocale={"locale":"en","strings":{}}</script>' +
        this.scripts() +
      '</body>' +
    '</html>'
  );
};

HtmlAdapter.prototype.ngApp = function() {
  var project = this.example.project
  ,   result = ''
  ;
  if (project && project.ngApp) {
    result = ` ng-app="${ project.ngApp }"`;
  }
  return result;
};

HtmlAdapter.prototype.styles = function() {
  var project = this.example.project
  ,   snippets = this.snippets
  ,   styles = []
  ;
  if (project) {
    project.styles.forEach(function(url) {
      styles.push(`<link href="${url}" media="screen" rel="stylesheet">`);
    });
  }
  if (snippets['text/css']) {
    snippets['text/css'].forEach(function(snippet) {
      styles.push(`<style>${ snippet.code }</style>`);
    });
  }
  return styles.join('');
};

HtmlAdapter.prototype.scripts = function() {
  var project = this.example.project
  ,   snippets = this.snippets
  ,   scripts = []
  ;
  if (project) {
    project.scripts.forEach(function(url) {
      scripts.push(`<script src="${url}"></script>`);
    });
  }
  if (snippets['text/javascript']) {
    snippets['text/javascript'].forEach(function(snippet) {
      scripts.push(`<script>${ snippet.code }</script>`);
    });
  }
  return scripts.join('');
};

HtmlAdapter.prototype.body = function() {
  var example = this.example
  ,   snippets = this.snippets
  ,   markup = []
  ;
  if (snippets['text/html']) {
    snippets['text/html'].forEach(function(snippet) {
      markup.push(snippet.code);
    });
  }
  return markup.join('');
};


function Project(project) {
  _.extend(this, {
    styles: [],
    scripts: []
  }, project);
}


function bool(string) {
  var s = String(string).toLowerCase().trim();
  return s === 'true' ? true : false;
}

function isMimeTypeHtml(mimeType) {
  var t = mimeType || 'text/html';
  return t.toLowerCase() === 'text/html';
}

function escape(string) {
  var replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  var result = string;

  _.forOwn(replacements, function(replacement, string) {
    var regexp = new RegExp(string, 'gmi');
    result = result.replace(regexp, replacement);
  });

  return result;
}

function normalizeIndent(string) {
  var lines = string.split("\n")
  ,   result = []
  ,   indent = 0
  ;

  // Get rid of empty lines at the beginning
  while (lines.length && blank.test(lines[0])) {
    lines.shift();
  }

  // Get rid of empty lines at the end
  while (lines.length && blank.test(lines[lines.length - 1])) {
    lines.pop();
  }

  // Measure indent of first non-blank line
  if (/^([\t ]+)/.test(lines[0])) {
    indent = RegExp.$1.length;
  }

  // Add lines minus excess indentation
  lines.forEach(function(line, index) {
    result.push(line.slice(indent));
  });

  return result.join("\n");
}

function normalizeHtml(string) {
  var emptyAttr = /\s([a-z-]+)=(""|''|&quot;&quot;)/mgi;
  return string.replace(emptyAttr, ' $1');
}

module.exports = CodePreview;
