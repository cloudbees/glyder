import gulp from 'gulp';
import stylish from 'jshint-stylish';
import config from '../config';
import browserSync from 'browser-sync';
import reload from '../util/reload';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

function lint(files, options) {
  return () => {
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
