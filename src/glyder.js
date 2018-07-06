import gulp from 'gulp';
import program from 'commander'
import {version} from '../package.json'

program
  .version(`${version}`)

program
  .command('serve <input> <output>')
    .action((input, output, cmd) => {
      require('./glyder/gulpfile.babel.js'); 
      gulp.start('serve');
    })

program
  .parse(process.argv)
