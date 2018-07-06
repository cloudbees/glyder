import gulp from 'gulp';
import program from 'commander'
import {version} from '../package.json'

program
  .version(`${version}`)

program
  .command('serve <input> <output>')
    .action((input, output, cmd) => {
      process.env.projectInputDir = input
      process.env.projectOutputDir = output
      require('./glyder/gulpfile.babel.js'); 
      gulp.start('serve');
    })

program
  .command('build <input> <output>')
    .action((input, output, cmd) => {
      process.env.projectInputDir = input
      process.env.projectOutputDir = output
      require('./glyder/gulpfile.babel.js'); 
      gulp.start('build');
    })

program
  .command('clean <input> <output>')
    .action((input, output, cmd) => {
      process.env.projectInputDir = input
      process.env.projectOutputDir = output
      require('./glyder/gulpfile.babel.js'); 
      gulp.start('clean');
    })

program
  .parse(process.argv)
