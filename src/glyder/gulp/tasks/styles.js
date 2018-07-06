import gulp from 'gulp';
import config from '../config';
import browserSync from 'browser-sync';
import reload from '../util/reload';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
gulp.task('styles', () => {
  var building = process.env.build === 'true';
  console.log(config.src.glob('styles'))
  console.log(config.tmp.path('styles'))
  console.log(process.cwd())

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
