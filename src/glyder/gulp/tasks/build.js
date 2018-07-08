var gulp = require('gulp');
var config = require('../config');
var gulpLoadPlugins = require('gulp-load-plugins');
var runSequence = require('run-sequence');

var $ = gulpLoadPlugins();

gulp.task('build-start', function(cb) {
  process.env.build = 'true';
  cb();
});

gulp.task('build-finish', function() {
  return gulp.src(config.dest.glob())
    .pipe($.size({title: 'build', gzip: true}));
});

gulp.task('misc-build-files', function() {
  return gulp.src(['src/CNAME'])
    .pipe(gulp.dest(config.dest.path('html')))
})

gulp.task('build', function(cb) {
  runSequence(
    'build-start',
    'clean',
    ['scripts', 'lint', 'html', 'images', 'extras'],
    'misc-build-files',
    'build-finish',
    cb
  );
});
