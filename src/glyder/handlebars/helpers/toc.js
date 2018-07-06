import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

const headingSpacing = {
  'H3': 'pl2',
  'H4': 'pl4',
  'H5': 'pl6',
  'H6': 'pl8'
}

const generateToC = (tocData) => {
  let newTOC = `<div class='ToC'>`
  newTOC += `<div class='ToC-Heading'>In this article</div>`

  tocData.forEach(tocItem => {
    newTOC += `<li class='ToC-Item'><a href='#${tocItem.id}' class='ToCItem-Link ${headingSpacing[tocItem.type]}'>${tocItem.title}</a></li>`
  })

  newTOC += `</div>`
  return new $.compileHandlebars.Handlebars.SafeString(newTOC)
}

module.exports = {
  generateToC
}
