var _ = require('lodash');
var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var frontmatter = require('front-matter');
var showdown = require('showdown');
var config = require('../config');
var reload = require('../util/reload');
var CodePreview = require('../plugins/gulp-code-preview');
var gulpLoadPlugins = require('gulp-load-plugins');
var cheerio = require('cheerio');
var strftime = require('strftime');
var regexpQuote = require('regexp-quote');

var $ = gulpLoadPlugins();

function createToc(markup) {
  var $ = cheerio.load(markup)
  var headings = $('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
  var toc = []

  if (headings.length > 0) {
    headings.each(function() {
      var heading = $(this)
      toc.push({ title: heading.text(), id: heading.attr('id'), type: heading.prop('tagName') })
    })
  }
  return toc
}

function activeLink(markup, title) {
  var $ = cheerio.load(markup)

  if (title) {
    var navItem = $(".ChromeNav-Item:contains(" + title + ")") 
    navItem.addClass('is-active')
    navItem.closest('.ChromeNav-Group').addClass('is-expanded')
  }

  return $.html()
}

function makeUrl(file) {
  var src = path.resolve(config.src.path())
  var srcRegExp = new RegExp("^" + regexpQuote(src))
  var url = file.path
  url = url.replace(/\.md$/, '.html')
  url = url.replace(/index\.html$/, '')
  url = url.replace(srcRegExp, '')
  return url
}

gulp.task('navigation.json', function() {
  var articlesBySection = {}
  config.project.sections.forEach(function(section) {
    if (section.hasOwnProperty('key')) {
      articlesBySection[section.key] = []
    }
  })
  return gulp.src(config.src.glob('markdown'))
    .pipe($.data(function(file) {
      var fm = frontmatter(String(file.contents))
      var attrs = fm.attributes
      if (attrs.section && articlesBySection.hasOwnProperty(attrs.section)) {
        articlesBySection[attrs.section].push({
          title: attrs.title,
          url: makeUrl(file),
          path: file.path,
          index: attrs.hasOwnProperty('index') ? attrs.index : 100
        })
      }
    }))
    .on('finish', function() {
      var fname = path.join(config.tmp.path(), 'navigation.json')
      var sections = _.cloneDeep(config.project.sections)
      var navigation = []
      sections.forEach(function(section) {
        if (section.hasOwnProperty('key') && articlesBySection[section.key].length) {
          section.articles = _.sortBy(articlesBySection[section.key], ['index', 'title'])
          navigation.push(section)
        }
      })
      fs.writeFileSync(fname, JSON.stringify(navigation, null, 2))
    })
})

gulp.task('markdown', ['navigation.json', 'layouts'], function() {
  var navFile = path.join(config.tmp.path(), '/navigation.json')
  var navRaw = fs.readFileSync(navFile)
  var navigation = JSON.parse(navRaw)
  var markdown = new showdown.Converter({
    // Valid showdown options can be found:
    // https://github.com/showdownjs/showdown#valid-options

    // Provides GitHub style header IDs which are hyphenated when the header is
    // separated by spaces
    ghCompatibleHeaderId: true,
    simplifiedAutoLink: true
  })
  var building = process.env.build === 'true';
  var meta = {
    title: 'Style Guide',
    logo: config.project.logo,
    copyright: strftime(config.project.copyright),
    styleguide: config.project,
    navigation: navigation
  };
  var previews = new CodePreview(config.previews);
  return gulp.src(config.src.glob('markdown'))
    .pipe(previews.extract())
    .pipe($.data(function(file) {
      var content = frontmatter(String(file.contents));
      var filename = path.join(config.tmp.path('layouts'), (content.layout || 'main') + '.hbs');
      var layout = fs.readFileSync(filename);
      var result = markdown.makeHtml(content.body)
      content.attributes['contents'] = result;
      file.contents = new Buffer(layout);
      content.attributes.tocData = createToc(result)
      return content.attributes;
    }))

    .pipe($.compileHandlebars(meta, config.handlebars.options))
    .pipe($.data(function(file) {
      var title = JSON.stringify(file.data.title)
      file.contents = new Buffer(activeLink(String(file.contents), title))
    }))
    .pipe($.extReplace('.html'))

    .pipe(previews.write())

    .pipe(gulp.dest(config.tmp.path()))
    .pipe($.if(building, gulp.dest(config.dest.path())))

    .on('finish', function() {
      previews.files()
        .pipe(gulp.dest(config.tmp.path()))
        .pipe($.if(building, gulp.dest(config.dest.path())))
      ;
    })

    .pipe(reload())
  ;
});
