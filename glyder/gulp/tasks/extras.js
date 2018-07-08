var gulp = require('gulp');
var config = require('../config');
var reload = require('../util/reload');
var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

gulp.task('extras', function() {
  var building = process.env.build === 'true';

  return gulp.src(
      config.src.glob('extras'),
      { dot: true }
    )
    .pipe(gulp.dest(config.tmp.path('extras')))

    .pipe($.if(building, gulp.dest(config.dest.path('extras'))))

    .pipe(reload());
});
