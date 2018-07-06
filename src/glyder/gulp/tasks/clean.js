import gulp from 'gulp';
import config from '../config';
import del from 'del';

// Task to delete /.tmp and /build folders
gulp.task('clean', del.bind(null, [config.tmp.path(), config.dest.path()]));
