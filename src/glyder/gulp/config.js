import _ from 'lodash';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';

const iconHelpers = require('../handlebars/helpers/icon')
const navHelpers = require('../handlebars/helpers/nav')
const textHelpers = require('../handlebars/helpers/text')
const tocHelpers = require('../handlebars/helpers/toc')

const $ = gulpLoadPlugins();

if (!process.env.projectInputDir) {
  console.error('Please specify a project input path')
  process.exit(1)
}
if (!process.env.projectOutputDir) {
  console.error('Please specify a project output path')
  process.exit(1)
}

var roots = {
  glyder: path.join(__dirname, '..'),
  project: process.env.projectInputDir
};
var src = 'src';
var dest = process.env.projectOutputDir;
var tmp = '.tmp';

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

export default config;
