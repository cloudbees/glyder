#!/usr/bin/env node

var gulp = require('gulp');
var program = require('commander');
var package = require('./package.json');
var version = package.version;
var colors = require('colors');
var fs = require('fs');
var _ = require ('lodash');

program
  .version(`${version}`)

program
  .command('serve')
  .description('start a development web server with the generated style guide at localhost:9000')
  .action(function(cmd) {
    console.log('Serving style guide at http://localhost:9000... press Ctrl+C to stop.'.green);
    runGulpTask('serve');
  })

program
  .command('build')
  .description('compile the style guide in the output directory (specified in glyder.json)')
  .action(function(cmd) {
    console.log('building...'.green);
    runGulpTask('build');
  })

program
  .command('clean')
  .description('remove all files from the output directory (specified in glyder.json)')
  .action(function(cmd) {
    console.log('cleaning...'.green);
    runGulpTask('clean');
  })

program
  .on('command:*', function() {
    console.error(('Invalid command: glyder ' + program.args.join(' ')).red);
    program.outputHelp();
    process.exit(1);
  })

program
  .parse(process.argv)

if (program.args.length > 1) {
  console.error('Please specify a command.'.red);
  program.outputHelp();
  process.exit(1);
}

function runGulpTask(task) {
  var filename = './glyder.json';
  if (!process.env.GLYDER_CONFG && fs.existsSync(filename)) {
    process.env.GLYDER_CONFIG = filename;
  } else {
    console.error('Please use a project configuration file (glyder.json) in the root of your project directory')
    process.exit(1)
  }
  require('./glyder/gulpfile.js');
  gulp.start(task);
}
