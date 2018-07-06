import gulp from 'gulp';
require('./glyder/gulpfile.babel.js'); 

if (gulp.tasks.styles) { 
    console.log('gulpfile contains task!');
    gulp.start('styles');
}
