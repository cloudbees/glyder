import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

const icon = (options) => {
  let classNames = options.hash.classNames || ''
  return new $.compileHandlebars.Handlebars.SafeString(`
    <svg class="Icon ${classNames}">
      <use xlink:href="#${options.hash.icon}"></use>
    </svg>
  `)
}

module.exports = {
  icon
}
