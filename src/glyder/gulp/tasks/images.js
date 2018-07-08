var gulp = require('gulp');
var config = require('../config');
var reload = require('../util/reload');
var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

gulp.task('images', function() {
  var building = process.env.build === 'true';

  return gulp.src(config.src.glob('images'))
    .pipe(gulp.dest(config.tmp.path('images')))

    .pipe($.if(building, $.if($.if.isFile,
      $.cache($.imagemin({
        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs, they are often used
        // as hooks for embedding and styling
        svgoPlugins: [{cleanupIDs: false}]
      }))
      .on('error', function (err) {
        console.log(err);
        this.end();
      })
    )))
    .pipe($.if(building, gulp.dest(config.dest.path('images'))))

    .pipe(reload());
});
