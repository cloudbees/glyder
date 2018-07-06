import gulp from 'gulp';
import config from '../config';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();

gulp.task('build-start', (cb) => {
  process.env.build = 'true';
  cb();
});

gulp.task('build-finish', () => {
  return gulp.src(config.dest.glob())
    .pipe($.size({title: 'build', gzip: true}));
});

gulp.task('misc-build-files', () => {
  return gulp.src(['src/CNAME'])
    .pipe(gulp.dest(config.dest.path('html')))
})

gulp.task('build', (cb)=> {
  runSequence(
    'build-start',
    'clean',
    ['scripts', 'lint', 'html', 'images', 'extras'],
    'misc-build-files',
    'build-finish',
    cb
  );
});
