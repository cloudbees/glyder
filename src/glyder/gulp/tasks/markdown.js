import gulp from 'gulp';
import gutil from 'gulp-util';
import fs from 'fs';
import path from 'path';
import frontmatter from 'front-matter';
import showdown from 'showdown';
import config from '../config';
import reload from '../util/reload';
import CodePreview from '../plugins/gulp-code-preview';
import gulpLoadPlugins from 'gulp-load-plugins';
import cheerio from 'cheerio'

const $ = gulpLoadPlugins();

function createToc(markup) {
  const $ = cheerio.load(markup)
  let headings = $('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
  let toc = []

  if (headings.length > 0) {
    headings.each(function() {
      let heading = $(this)
      toc.push({ title: heading.text(), id: heading.attr('id'), type: heading.prop('tagName') })
    })
  }
  return toc
}

function activeLink(markup, title) {
  const $ = cheerio.load(markup)

  if (title) {
    let navItem = $(".ChromeNav-Item:contains(" + title + ")") 
    navItem.addClass('is-active')
    navItem.closest('.ChromeNav-Group').addClass('is-expanded')
  }

  return $.html()
}

gulp.task('markdown', ['layouts'], () => {
  const markdown = new showdown.Converter({
    // Valid showdown options can be found:
    // https://github.com/showdownjs/showdown#valid-options

    // Provides GitHub style header IDs which are hyphenated when the header is
    // separated by spaces
    ghCompatibleHeaderId: true,
    simplifiedAutoLink: true
  })
  var building = process.env.build === 'true';
  var meta = { title: 'Style Guide' };
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
      let title = JSON.stringify(file.data.title)
      file.contents = new Buffer(activeLink(String(file.contents), title))
    }))
    .pipe($.extReplace('.html'))

    .pipe(previews.write())

    .pipe(gulp.dest(config.tmp.path()))
    .pipe($.if(building, gulp.dest(config.dest.path())))

    .on('finish', () => {
      previews.files()
        .pipe(gulp.dest(config.tmp.path()))
        .pipe($.if(building, gulp.dest(config.dest.path())))
      ;
    })

    .pipe(reload())
  ;
});
