var gulp = require('gulp');
var config = require('../config');
var path = require('path');
var browserSync = require('browser-sync');
var reload = require('../util/reload');
var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

var root = path.join(__dirname, '..', '..', '..');

gulp.task('scripts:vendor', function() {
  var building = process.env.build === 'true';

  return gulp.src([
    path.join(root, 'node_modules/jquery/dist/jquery.min.js'),
    path.join(root, 'node_modules/jquery/dist/jquery.min.js')
  ])
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(config.tmp.path('scripts')))
    .pipe($.if(building, $.if('*.js', $.uglify())))
    .pipe($.if(building, gulp.dest(config.dest.path('scripts'))))
})

gulp.task('scripts:ace', function() {
  var building = process.env.build === 'true';

  return gulp.src([
    path.join(root, 'node_modules/ace-builds/src-min/ace.js'),
    path.join(root, 'node_modules/ace-builds/src-min/theme-xcode.js'),
    path.join(root, 'node_modules/ace-builds/src-min/mode-html.js'),
    path.join(root, 'node_modules/ace-builds/src-min/mode-javascript.js'),
    path.join(root, 'node_modules/ace-builds/src-min/mode-css.js'),
    path.join(root, 'node_modules/ace-builds/src-min/mode-scss.js')
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
