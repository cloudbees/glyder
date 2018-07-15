var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var reload = require('../util/reload');
var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

gulp.task('html', ['markdown']);

gulp.task('layouts', ['styles', 'scripts'], function() {
  var building = process.env.build === 'true';
  var assets = $.useref.assets({searchPath: [config.tmp.path(), config.src.path(), '.']});
  var justhbs = $.filter(['**/*.hbs'], {restore: true});
  var justjs = $.filter(['**/*.js'], {restore: true});
  var justcss = $.filter(['**/*.css'], {restore: true});
  var justassets = $.filter(['**/*.js', '**/*.css'], {restore: true});

  return gulp.src([config.src.glob('layouts'), config.src.glob('partials')])
    .pipe($.preprocess())
    .pipe($.if(building, assets))
  
    .pipe(justjs)
    .pipe($.if(building, $.uglify()))
    .pipe(justjs.restore)

    .pipe(justcss)
    .pipe($.if(building, $.minifyCss({compatibility: '*'})))
    .pipe(justcss.restore)

    .pipe($.if(building, assets.restore()))
    .pipe($.if(building, $.useref()))

    .pipe(justhbs)
    .pipe(gulp.dest(config.tmp.path('layouts')))
    .pipe(justhbs.restore)

    .pipe(justassets)
    .pipe($.if(building, gulp.dest(config.dest.path('html'))))
    .pipe(justassets.restore)
  ;
});
