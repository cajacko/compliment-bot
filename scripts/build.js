import rimraf from 'rimraf';
import { exec } from 'child_process';

const cmd = 'babel src -d dist -s --copy-files';

rimraf(
  'dist/*',
  {},
  (distError) => {
    if (distError) {
      throw distError;
    }

    exec(cmd, (execError, stdout, stderr) => {
      if (stdout) {
        // eslint-disable-next-line
        console.log(stdout);
      }

      if (stderr) {
        // eslint-disable-next-line
        console.log(stderr);
      }

      if (execError) {
        throw execError;
      }
    });
  },
);
