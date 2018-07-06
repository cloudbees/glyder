import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

const navItem = (url, title) => {
  return new $.compileHandlebars.Handlebars.SafeString(`<a class="ChromeNav-Item" href="/${url}/">${title}</a>`)
}

const navGroup = (options) => {
  let classNames = options.hash.classNames || ''
  return new $.compileHandlebars.Handlebars.SafeString(`
    <div class="ChromeNav-Group ${classNames}">
      <h2 class="ChromeNav-GroupTitle">${options.hash.title} <span class="ChromeNav-GroupTrigger"><svg class="Icon x16"><use xlink:href="#chevron-left"></use></svg></span></h2>
      <div class="ChromeNav-Items">
        ${options.fn(this)}
      </div>
    </div>
  `)
}

const baseUrl = () => {
  if (process.env.server) {
    return 'http://localhost:9000'
  } else {
    return 'https://design.cloudbees.com'  
  }
}

module.exports = {
  navItem,
  navGroup,
  baseUrl
}
