var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var reload = require('../util/reload');
var gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();
gulp.task('styles', function() {
  var building = process.env.build === 'true';

  return gulp.src(config.src.glob('styles'))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())

    .pipe(gulp.dest(config.tmp.path('styles')))
    .pipe($.if(building, gulp.dest(config.dest.path('styles'))))

    .pipe(reload());
});
