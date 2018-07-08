var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();

var icon = function(options) {
  var classNames = options.hash.classNames || ''
  return new $.compileHandlebars.Handlebars.SafeString(`
    <svg class="Icon ${classNames}">
      <use xlink:href="#${options.hash.icon}"></use>
    </svg>
  `)
}

module.exports = {
  icon
}
