var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var gulpLoadPlugins = require('gulp-load-plugins');

var iconHelpers = require('../handlebars/helpers/icon')
var navHelpers = require('../handlebars/helpers/nav')
var textHelpers = require('../handlebars/helpers/text')
var tocHelpers = require('../handlebars/helpers/toc')

var $ = gulpLoadPlugins();
var project = readProjectConfig()
var roots = {
  glyder: path.join(__dirname, '..'),
  project: project.input
};

var config = {
  project: project,

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
    root: 'project',
    path: '',
    glob: '**/*.{svg,png,gif,jpeg,jpg}'
  },

  "glyder-images": {
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
    packages: project.packages
  }
};

function readProjectConfig() {
  const cosmic = require('cosmiconfig');
  const explorer = cosmic('glyder');
  const result = explorer.searchSync();

  if (!result || result.isEmpty) {
    console.error('\n\nPlease define a glyder configuration (e.g. glyder.json)\n\n');
    process.exit(1);
  }

  var defaults = {
    input: './src',
    output: './build',
    tmp: __dirname + '/.tmp',
    logo: '/glyder-logo.svg',
    copyright: '© %Y Your Company Here',
    sections: [
      { "name": "Guidelines", "key": "guidelines" },
      { "name": "Components", "key": "components" }
    ],
    packages: [
      {
        name: 'oxygen',
        styles: [ 'http://oxygencss.com/styles/site.css' ],
        scripts: [ 'http://oxygencss.com/styles/site.js' ],
      }
    ]
  };

  var out = _.merge({}, defaults, result.config);

  if (!fs.existsSync(out.tmp)) {
    fs.mkdirSync(out.tmp);
  }

  return out;
}

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
      return path.join(project.tmp, c.path);
    } else {
      return project.tmp;
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
      return path.join(project.output, c.path);
    } else {
      return project.output;
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
