import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

const mainHeading = (title) => {
  if (title) {
    return new $.compileHandlebars.Handlebars.SafeString(`<h1>${title}</h1>`)
  }
}

module.exports = {
  mainHeading
}
