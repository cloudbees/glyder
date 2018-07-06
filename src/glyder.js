import gulp from 'gulp';
require('./glyder/gulpfile.babel.js'); 

if (gulp.tasks.serve) { 
    console.log('gulpfile contains task!');
    gulp.start('serve');
}
