import _ from 'lodash'; import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';

const iconHelpers = require('../handlebars/helpers/icon')
const navHelpers = require('../handlebars/helpers/nav')
const textHelpers = require('../handlebars/helpers/text')
const tocHelpers = require('../handlebars/helpers/toc')

const $ = gulpLoadPlugins();

var src = 'src';
var dest = 'build';
var tmp = '.tmp';

var config = {
  html: {
    root: '',
    glob: ['**/*.html']
  },

  handlebars: {
    options: {} // Options added below
  },

  layouts: {
    root: 'handlebars/layouts',
    glob: '**/*.hbs'
  },

  partials: {
    root: 'handlebars/partials',
    glob: '**/*.hbs'
  },

  markdown: {
    root: 'docs',
    glob: '**/*.md'
  },

  scripts: {
    root: 'scripts',
    glob: '**/*.js'
  },

  styles: {
    root: 'styles',
    glob: {
      'default': ['**/*.scss', '**/*.[^_]scss'],
      'all': '**/*.scss'
    }
  },

  images: {
    root: 'images',
    glob: '**/*.{svg,png,gif}'
  },

  fonts: {
    root: 'fonts',
    glob: '**/*.{eot,svg,ttf,woff,woff2}'
  },

  extras: {
    root: '',
    glob: ['*.*', '!*.html']
  },

  test: {
    src: 'test'
  },

  specs: {
    root: 'test/spec',
    glob: '*.spec.js'
  },

  previews: {
    projects: [
      {
        name: 'oxygen',
        styles: [ 'http://oxygencss.com/styles/site.css' ],
        scripts: [ 'http://oxygencss.com/styles/site.js' ],
        beforeScripts: ''
      }
    ]
  }
};

var joinPath = path.join;

function prependPathToGlob(glob, path, set) {
  var globs = [];
  if (glob.constructor === Object) {
    return prependPathToGlob(glob[set || 'default'], path);
  } else if (glob.constructor === Array) {
    glob.forEach(function(g) {
      if (_.startsWith(g, '!')) {
        globs.push('!' + joinPath(path, g.replace('!', '')));
      } else {
        globs.push(joinPath(path, g));
      }
    });
    return globs;
  } else {
    return joinPath(path, glob);
  }
}

config.src = {
  glob: function(type, set) {
    if (type) {
      var c = config[type];
      return prependPathToGlob(c.glob, config.src.path(type), set);
    } else {
      return prependPathToGlob('**/*', config.src.path());
    }
  },

  path: function(type) {
    if (type) {
      var c = config[type];
      if (c.src) {
        return c.src;
      } else {
        return joinPath(src, c.root);
      }
    } else {
      return src;
    }
  }
};

config.tmp = {
  path: function(type) {
    if (type) {
      var c = config[type];
      return joinPath(tmp, c.root);
    } else {
      return tmp;
    }
  }
};

config.dest = {
  glob: function(type, set) {
    if (type) {
      var c = config[type];
      return prependPathToGlob(c.glob, config.dest.path(type), set);
    } else {
      return prependPathToGlob('**/*', config.dest.path());
    }
  },

  path: function(type) {
    if (type) {
      var c = config[type];
      return joinPath(dest, c.root);
    } else {
      return dest;
    }
  }
};

config.handlebars.options.batch = [
  config.tmp.path('layouts')
]

config.handlebars.options.helpers = {
  navItem: navHelpers.navItem,
  navGroup: navHelpers.navGroup,
  baseUrl: navHelpers.baseUrl,
  icon: iconHelpers.icon,
  mainHeading: textHelpers.mainHeading,
  toc: tocHelpers.generateToC
}

export default config;
