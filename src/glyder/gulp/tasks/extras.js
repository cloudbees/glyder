import gulp from 'gulp';
import config from '../config';
import reload from '../util/reload';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

gulp.task('extras', () => {
  var building = process.env.build === 'true';

  return gulp.src(
      config.src.glob('extras'),
      { dot: true }
    )
    .pipe(gulp.dest(config.tmp.path('extras')))

    .pipe($.if(building, gulp.dest(config.dest.path('extras'))))

    .pipe(reload());
});
