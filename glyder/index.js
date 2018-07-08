var gulp = require('gulp');
var program = require('commander');
var version = require('../package.json');
var colors = require('colors');

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
  .on('command:*', function() {
    console.error(('Invalid command: glyder ' + program.args.join(' ')).red);
    program.outputHelp();
    process.exit(1);
  })

program
  .parse(process.argv)
