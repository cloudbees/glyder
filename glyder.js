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

function readProjectConfig() {
  var fname = './glyder.json';
  var defaults = {
    input: './src',
    output: './build',
    tmp: './.tmp',
  };
  var raw = fs.existsSync(fname) ? fs.readFileSync('./glyder.json') : '{}';
  var parsed = JSON.parse(raw);
  var result = _.merge({}, defaults, parsed);
  return result;
}

function setProjectOnEnv(project) {
  process.env.projectConfig = 'true';
  process.env.projectTmpDir = project.tmp;
  process.env.projectInputDir = project.input;
  process.env.projectOutputDir = project.output;
}

function runGulpTask(task) {
  var project = readProjectConfig();
  setProjectOnEnv(project);
  require('./glyder/gulpfile.js');
  gulp.start(task);
}
