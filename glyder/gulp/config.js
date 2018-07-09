var _ = require('lodash');
var path = require('path');
var gulpLoadPlugins = require('gulp-load-plugins');

var iconHelpers = require('../handlebars/helpers/icon')
var navHelpers = require('../handlebars/helpers/nav')
var textHelpers = require('../handlebars/helpers/text')
var tocHelpers = require('../handlebars/helpers/toc')

var $ = gulpLoadPlugins();

if (!process.env.projectConfig) {
  console.error('Please use a project configuration file (glyder.json) in the root of your project directory')
  process.exit(1)
}

var roots = {
  glyder: path.join(__dirname, '..'),
  project: process.env.projectInputDir
};
var src = 'src';
var dest = process.env.projectOutputDir;
var tmp = process.env.projectTmpDir;

var config = {
  html: {
    root: 'project',
    path: '',
    glob: ['**/*.html']
  },

  handlebars: {
    options: {} // Options added below
  },

  layouts: {
    root: 'glyder',
    path: 'handlebars/layouts',
    glob: '**/*.hbs'
  },

  partials: {
    root: 'glyder',
    path: 'handlebars/partials',
    glob: '**/*.hbs'
  },

  markdown: {
    root: 'project',
    path: '',
    glob: '**/*.md'
  },

  scripts: {
    root: 'glyder',
    path: 'scripts',
    glob: '**/*.js'
  },

  styles: {
    root: 'glyder',
    path: 'styles',
    glob: {
      'default': ['**/*.scss', '**/*.[^_]scss'],
      'all': '**/*.scss'
    }
  },

  images: {
    root: 'glyder',
    path: 'images',
    glob: '**/*.{svg,png,gif}'
  },

  fonts: {
    root: 'glyder',
    path: 'fonts',
    glob: '**/*.{eot,svg,ttf,woff,woff2}'
  },

  extras: {
    root: 'project',
    path: '',
    glob: ['*.*', '!*.html', '!*.hbs', '!*.md']
  },

  test: {
    root: 'glyder',
    src: 'test'
  },

  specs: {
    root: 'glyder',
    path: 'test/spec',
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

function prependPathToGlob(glob, aPath, set) {
  var globs = [];
  if (glob.constructor === Object) {
    return prependPathToGlob(glob[set || 'default'], aPath);
  } else if (glob.constructor === Array) {
    glob.forEach(function(g) {
      if (_.startsWith(g, '!')) {
        globs.push('!' + path.join(aPath, g.replace('!', '')));
      } else {
        globs.push(path.join(aPath, g));
      }
    });
    return globs;
  } else {
    return path.join(aPath, glob);
  }
}

config.src = {
  glob: function(type, set) {
    if (type) {
      var c = config[type];
      var p = config.src.path(type);
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
        return path.join(roots[c.root], c.path);
      }
    } else {
      return roots.project;
    }
  }
};

config.tmp = {
  path: function(type) {
    if (type) {
      var c = config[type];
      return path.join(tmp, c.path);
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
      return path.join(dest, c.path);
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

module.exports = config;
