import {PluginError} from 'gulp-util';
import through from 'through2';
import source  from 'vinyl-source-stream';
import vinylBuffer from 'vinyl-buffer';
import es from 'event-stream';
import cheerio from 'cheerio';
import _ from 'lodash';

const PLUGIN_NAME = 'gulp-data-toc';

const tabNames = {
  'html': 'HTML',
  'css': 'CSS',
  'javascript': 'JavaScript'
};

const blank = /^\s*$/m;

class CodePreview {
  constructor(config) {
    this.setConfig(config);
    this.examples = [];
  }

  setConfig(config) {
     this.config = _.extend({
      directory: 'previews',
      baseUrl: '/previews',
      projects: []
    }, config);
    this.setProjects(this.config.projects);
    return this.config;
  }

  setProjects(projects) {
    var object = {};
    projects.forEach((project) => {
      object[project.name] = new Project(project);
    });
    this.projects = object;
    return this.projects;
  }

  extract() {
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

      $('example').each((i, el) => {
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
  }

  write() {
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

      $('[data-example-placeholder]').each((i, el) => {
        var $el = $(el)
        ,   id = $el.attr('data-example-placeholder')
        ,   example = _.find(preview.examples, {id: id})
        ;
        $el.replaceWith(example.toPreview());
      });

      file.contents = new Buffer(normalizeHtml($.html()));

      return cb(null, file);
    });
  }

  files() {
    var streams = [];

    this.examples.forEach((example) => {
      var filename = example.filename()
      ,   stream = source(filename)
      ,   streamEnd = stream
      ;
      stream.write(example.toHtml());

      // In the next process cycle, end the stream
      process.nextTick(() => { stream.end(); });

      // Turn the contents into a vinyl buffer
      streamEnd = streamEnd.pipe(vinylBuffer());

      streams.push(streamEnd);
    });

    return es.merge.apply(this, streams);
  }

}

class Snippet {
  constructor(code, mimeType) {
    this.code = normalizeIndent(code);
    this.mimeType = (mimeType || 'text/html').trim();
  }

  name() {
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
  }
}

let exampleCount = 0;

class Example {
  constructor(project, render, config) {
    this.project = project;
    this.render = typeof(render) === 'boolean' ? render : true;
    this.config = config;
    this.snippets = [];
    this.id = String(exampleCount += 1);
  }

  filename() {
    return `${this.config.directory}/example-${this.id}.html`;
  }

  url() {
    return `${this.config.baseUrl}/example-${this.id}.html`;
  }

  renderable() {
    return this.render && _.some(this.snippets, {mimeType: 'text/html'});
  }

  // HTML to temporarily mark where the preview should be inserted
  toPlaceholder() {
    var adapter = new PlaceholderAdapter(this);
    return adapter.toString();
  }

  // HTML to embed in the preview
  toPreview() {
    var adapter = new PreviewAdapter(this);
    return adapter.toString();
  }

  // HTML for iFrame
  toHtml() {
    var adapter = new HtmlAdapter(this);
    return adapter.toString();
  }
}

class PlaceholderAdapter {
  constructor(example) {
    this.example = example;
  }

  toString() {
    return `<div data-example-placeholder="${ this.example.id }"></div>`;
  }
}

class PreviewAdapter {
  constructor(example) {
    this.example = example;
  }

  toString() {
    return '<div class="code-preview">' + this.tabs() + this.content() + '</div>';
  }

  tabs() {
    var snippets = this.example.snippets
    ,   renderable = this.example.renderable()
    ,   tabs = []
    ;
    if (renderable) {
      tabs.push(`<span class="code-preview-tab is-selected">Preview</span>`);
    }
    if (renderable || snippets.length > 1) {
      snippets.forEach((snippet, i) => {
        var selected = renderable ? '' : (i === 0 ? ' is-selected' : '');
        tabs.push(`<span class="code-preview-tab">${ snippet.name() }</span>`);
      });
    }
    return tabs.length ? `<div class="code-preview-tabs">${ tabs.join('') }</div>` : '';
  }

  content() {
    var snippets = this.example.snippets
    ,   renderable = this.example.renderable() ? 1 : 0
    ,   content = []
    ;
    if (renderable) {
      content.push(`<iframe class="code-preview-content" src="${ this.example.url() }"></iframe>`);
    }
    snippets.forEach((snippet) => {
      var isHidden = this.tabs.length + renderable ? ' is-hidden' : '';
      var code = escape(snippet.code);
      content.push(`<div class="code-preview-content${ isHidden }" data-mime-type="${ snippet.mimeType }"><pre>${ code }</pre></div>`);
    });
    return content.join('');
  }
}

class HtmlAdapter {
  constructor(example) {
    this.example = example;
    this.snippets =  _.groupBy(example.snippets, 'mimeType');
  }

  toString() {
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
  }

  ngApp() {
    var project = this.example.project
    ,   result = ''
    ;
    if (project && project.ngApp) {
      result = ` ng-app="${ project.ngApp }"`;
    }
    return result;
  }

  styles() {
    var project = this.example.project
    ,   snippets = this.snippets
    ,   styles = []
    ;
    if (project) {
      project.styles.forEach((url) => {
        styles.push(`<link href="${url}" media="screen" rel="stylesheet">`);
      });
    }
    if (snippets['text/css']) {
      snippets['text/css'].forEach((snippet) => {
        styles.push(`<style>${ snippet.code }</style>`);
      });
    }
    return styles.join('');
  }

  scripts() {
    var project = this.example.project
    ,   snippets = this.snippets
    ,   scripts = []
    ;
    if (project) {
      project.scripts.forEach((url) => {
        scripts.push(`<script src="${url}"></script>`);
      });
    }
    if (snippets['text/javascript']) {
      snippets['text/javascript'].forEach((snippet) => {
        scripts.push(`<script>${ snippet.code }</script>`);
      });
    }
    return scripts.join('');
  }

  
  body() {
    var example = this.example
    ,   snippets = this.snippets
    ,   markup = []
    ;
    if (snippets['text/html']) {
      snippets['text/html'].forEach((snippet) => {
        markup.push(snippet.code);
      });
    }
    return markup.join('');
  }

}

class Project {
  constructor(project) {
    _.extend(this, {
      styles: [],
      scripts: []
    }, project);
  }
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
  const replacements = {
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

export default CodePreview;
