var gutil = require('gulp-util');
var browserSync = require('browser-sync');

// Stream to trigger browserSync if loaded
function reload(options) {
  var opts = Object.assign({stream: true}, options || {}); 
  if (process.env.server === 'true') {
    console.log('browser sync reload...');
    return browserSync.reload(opts);
  } else {
    return gutil.noop();
  }
}

module.exports = reload
