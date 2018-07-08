var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var reload = require('../util/reload');
var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

gulp.task('scripts:vendor', function() {
  var building = process.env.build === 'true';

  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
  ])
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(config.tmp.path('scripts')))
    .pipe($.if(building, $.if('*.js', $.uglify())))
    .pipe($.if(building, gulp.dest(config.dest.path('scripts'))))
})

gulp.task('scripts:ace', function() {
  var building = process.env.build === 'true';

  return gulp.src([
    'node_modules/ace-builds/src-min/ace.js',
    'node_modules/ace-builds/src-min/theme-xcode.js',
    'node_modules/ace-builds/src-min/mode-html.js',
    'node_modules/ace-builds/src-min/mode-javascript.js',
    'node_modules/ace-builds/src-min/mode-css.js',
    'node_modules/ace-builds/src-min/mode-scss.js'
  ])
    .pipe($.concat('ace.js'))
    .pipe(gulp.dest(config.tmp.path('scripts')))
    .pipe($.if(building, $.if('*.js', $.uglify())))
    .pipe($.if(building, gulp.dest(config.dest.path('scripts'))))
})

gulp.task('scripts', ['scripts:vendor', 'scripts:ace'], function() {
  var building = process.env.build === 'true';

  return gulp.src([
    config.src.glob('scripts')
  ])
    .pipe($.concat('honeycomb.js'))
    .pipe(gulp.dest(config.tmp.path('scripts')))
    .pipe($.if(building, $.if('*.js', $.uglify())))
    .pipe($.if(building, gulp.dest(config.dest.path('scripts'))))

    .pipe(reload());
});
