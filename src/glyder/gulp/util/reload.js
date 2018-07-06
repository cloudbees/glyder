import gutil from 'gulp-util';
import browserSync from 'browser-sync';

// Stream to trigger browserSync if loaded
export default function reload(options) {
  var opts = Object.assign({stream: true}, options || {}); 
  if (process.env.server === 'true') {
    console.log('browser sync reload...');
    return browserSync.reload(opts);
  } else {
    return gutil.noop();
  }
}
