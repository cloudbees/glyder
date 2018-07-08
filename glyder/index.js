var gulp = require('gulp');
var program = require('commander');
var version = require('../package.json');

program
  .version(`${version}`)

program
  .command('serve <input> <output>')
    .action(function(input, output, cmd) {
      process.env.projectInputDir = input
      process.env.projectOutputDir = output
      require('./gulpfile.js'); 
      gulp.start('serve');
    })

program
  .command('build <input> <output>')
    .action(function(input, output, cmd) {
      process.env.projectInputDir = input
      process.env.projectOutputDir = output
      require('./gulpfile.js'); 
      gulp.start('build');
    })

program
  .command('clean <input> <output>')
    .action(function(input, output, cmd) {
      process.env.projectInputDir = input
      process.env.projectOutputDir = output
      require('./gulpfile.js'); 
      gulp.start('clean');
    })

program
  .parse(process.argv)
