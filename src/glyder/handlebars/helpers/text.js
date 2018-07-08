var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();

var mainHeading = function(title) {
  if (title) {
    return new $.compileHandlebars.Handlebars.SafeString(`<h1>${title}</h1>`)
  }
}

module.exports = {
  mainHeading
}
