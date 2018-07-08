var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();

var headingSpacing = {
  'H3': 'pl2',
  'H4': 'pl4',
  'H5': 'pl6',
  'H6': 'pl8'
}

var generateToC = function(tocData) {
  var newTOC = `<div class='ToC'>`
  newTOC += `<div class='ToC-Heading'>In this article</div>`

  tocData.forEach(function(tocItem) {
    newTOC += `<li class='ToC-Item'><a href='#${tocItem.id}' class='ToCItem-Link ${headingSpacing[tocItem.type]}'>${tocItem.title}</a></li>`
  })

  newTOC += `</div>`
  return new $.compileHandlebars.Handlebars.SafeString(newTOC)
}

module.exports = {
  generateToC
}
