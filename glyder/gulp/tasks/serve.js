var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var reload = require('../util/reload');

gulp.task('serve', ['html', 'images', 'extras'], function() {
  process.env.server = 'true';

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: config.tmp.path()
    }
  });

  gulp.start('markdown')

  gulp.watch(config.src.glob('html'), ['html']);
  gulp.watch(config.src.glob('markdown'), ['html']).on('change', reload)
  gulp.watch(config.src.glob('layouts'), ['html']);
  gulp.watch(config.src.glob('images'), ['images', 'html']);
  gulp.watch(config.src.glob('styles', 'all'), ['styles']);
  gulp.watch(config.src.glob('scripts'), ['scripts']);
  gulp.watch(config.src.glob('extras'), ['extras']);
});

gulp.task('serve:build', ['build'], function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: config.dest.path()
    }
  });
});

gulp.task('serve:test', function() {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: config.src.path('test')
    }
  });

  gulp.watch(config.src.glob('specs')).on('change', reload);
  gulp.watch(config.src.glob('specs'), ['lint:test']);
});
