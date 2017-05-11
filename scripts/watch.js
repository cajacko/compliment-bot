import { create } from 'browser-sync';
import nodemon from 'nodemon';
import port from '../src/constants/port';
import listenLog from '../src/constants/listenLog';

const bs = create();

function watch() {
  let nodemonStarted = false;
  let bsStarted = false;

  nodemon({
    script: 'src/server/index.js',
    exec: 'node node_modules/babel-cli/bin/babel-node.js',
    ext: 'js, ejs, jsx',
    ignore: ['scripts/**/*', 'src/public/*.js'],
    stdout: false,
  });

  nodemon.on('quit', () => {
    if (bsStarted) {
      bs.exit();
    }
  }).on('readable', function readable() {
    this.stdout.setEncoding('utf8');
    this.stderr.setEncoding('utf8');

    this.stdout.on('data', (log) => {
      // eslint-disable-next-line
      console.log(log);

      if (listenLog === log || log.includes(listenLog)) {
        if (bsStarted) {
          bs.reload();
        }

        if (!nodemonStarted) {
          bs.init({
            proxy: `localhost:${port}`,
          }, () => {
            bsStarted = true;
          });

          nodemonStarted = true;
        }
      }
    });

    // eslint-disable-next-line
    this.stderr.on('data', log => console.log(log));
  });
}

watch();
