var gulp = require('gulp');
var stylish = require('jshint-stylish');
var config = require('../config');
var browserSync = require('browser-sync');
var reload = require('../util/reload');
var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

function lint(files, options) {
  return function() {
    return gulp.src(files)
      .pipe(reload({once: true}))
      .pipe($.jshint(options))
      .pipe($.jshint.reporter(stylish))
      .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint(config.src.glob('scripts')));
gulp.task('lint:test', lint(config.src.glob('specs'), testLintOptions));
