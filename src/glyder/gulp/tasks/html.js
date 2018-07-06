import gulp from 'gulp';
import config from '../config';
import browserSync from 'browser-sync';
import reload from '../util/reload';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

gulp.task('html', ['markdown']);

gulp.task('layouts', ['styles', 'scripts'], () => {
  var building = process.env.build === 'true';
  const assets = $.useref.assets({searchPath: [config.tmp.path(), config.src.path(), '.']});

  return gulp.src([config.src.glob('layouts'), config.src.glob('partials')])
    .pipe($.preprocess())
    .pipe($.if(building, assets))
    // .pipe($.if(building, $.if('*.js', $.uglify())))
    // .pipe($.if(building, $.if('*.css', $.minifyCss({compatibility: '*'}))))
    .pipe($.if(building, assets.restore()))
    .pipe($.if(building, $.useref()))

    .pipe($.if('*.hbs', gulp.dest(config.tmp.path('layouts'))))
    .pipe($.if(building, $.if('*.js', gulp.dest(config.dest.path('html')))))
    .pipe($.if(building, $.if('*.css', gulp.dest(config.dest.path('html')))))
  ;
});
