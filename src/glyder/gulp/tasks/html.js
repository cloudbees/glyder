import gulp from 'gulp';
import config from '../config';
import browserSync from 'browser-sync';
import reload from '../util/reload';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

gulp.task('html', ['markdown']);

gulp.task('layouts', ['styles', 'scripts'], () => {
  const building = process.env.build === 'true';
  const assets = $.useref.assets({searchPath: [config.tmp.path(), config.src.path(), '.']});
  const justhbs = $.filter(['**/*.hbs'], {restore: true});
  const justjs = $.filter(['**/*.js'], {restore: true});
  const justcss = $.filter(['**/*.css'], {restore: true});
  const justassets = $.filter(['**/*.js', '**/*.css'], {restore: true});

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
