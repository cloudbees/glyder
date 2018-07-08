var gulp = require('gulp');
var config = require('../config');
var del = require('del');

// Task to delete /.tmp and /build folders
gulp.task('clean', del.bind(null, [config.tmp.path(), config.dest.path()]));
