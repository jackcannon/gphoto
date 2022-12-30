import path from 'path';
import fsP from 'fs/promises';
import chalk from 'chalk';
import { seconds, wait } from 'swiss-ak';
import gPhoto from '../src';

const [exampleName] = process.argv.slice(2);

const examples = {
  autoDetect: async () => {
    await gPhoto.autoDetect();
  },
  autoDetectWithSerials: async () => {
    await gPhoto.autoDetectWithSerials();
  },
  reset: async () => {
    await gPhoto.reset();
  },
  abilities: async () => {
    await gPhoto.abilities();
  },
  listCameras: async () => {
    await gPhoto.listCameras();
  },
  listPorts: async () => {
    await gPhoto.listPorts();
  },
  appropriateKeys: async () => {
    const keys = await gPhoto.config.findAppropriateConfigKeys(['iso', 'shutterspeed2']);
    return keys; // ['/main/imgsettings/iso', '/main/capturesettings/shutterspeed2']
  },
  'get-all': async () => {
    await gPhoto.config.getAll();
  },
  'set-multiple': async () => {
    await gPhoto.config.setValues({
      '/main/imgsettings/iso': '2000',
      '/main/capturesettings/shutterspeed2': '1/2000'
    });
  },
  'get-iso': async () => {
    await gPhoto.config.getValues(['/main/imgsettings/iso']);
  },
  'set-iso': async () => {
    await gPhoto.config.setValues({ '/main/imgsettings/iso': '2500' });
  },
  'get-set-get': async () => {
    ____note('get iso and shutter speed');
    await gPhoto.config.get(['/main/imgsettings/iso', '/main/capturesettings/shutterspeed2']);

    ____note('set iso and shutter speed');
    await gPhoto.config.setValues({
      '/main/imgsettings/iso': '500',
      '/main/capturesettings/shutterspeed2': '1/100'
    });

    ____note('get iso and shutter speed again (with updated values)');
    await gPhoto.config.get(['/main/imgsettings/iso', '/main/capturesettings/shutterspeed2']);
  },
  'take-photo': async () => {
    await gPhoto.capture.image({
      directory,
      keep: 'raw',
      wait: getWaitUntilTime(),
      filename: 'image-%n.%C'
    });
  },
  preview: async () => {
    await gPhoto.capture.preview({
      directory,
      filename: 'preview-%n.%C'
    });
  },

  autofocus: async () => {
    await gPhoto.capture.image({
      directory,
      keep: 'raw',
      filename: 'autofocus-before.%C'
    });

    await gPhoto.autofocus(true);

    await gPhoto.capture.image({
      directory,
      keep: 'raw',
      filename: 'autofocus-after.%C'
    });
  },
  liveview: async () => {
    let count = 0;

    const liveview = await gPhoto.capture.liveview((buff) => {
      count++;
      if (count % 100 === 0) {
        ____note('save');
        fsP.writeFile(path.join(directory, `liveview-${count}.jpg`), buff);
      }
    }, false);

    ____note('start liveview');
    await liveview.start();

    ____note('waiting 20 seconds');
    await wait(seconds(20));

    ____note('stop liveview');
    await liveview.stop();
  },
  'liveview-with-autofocus': async () => {
    let count = 0;

    const liveview = await gPhoto.capture.liveview((buff) => {
      count++;
      if (count % 100 === 0) {
        ____note('save');
        fsP.writeFile(path.join(directory, `liveview-${count}.jpg`), buff);
      }
    }, false);

    ____note('start liveview');
    await liveview.start();

    ____note('waiting 10 seconds');
    await wait(seconds(10));

    ____note('autofocus');
    await gPhoto.autofocus(true);

    ____note('waiting 10 seconds');
    await wait(seconds(10));

    ____note('stop liveview');
    await liveview.stop();
  }
};

const now = Date.now();

const getWaitForTime = () => seconds(2);
const getWaitUntilTime = () => Date.now() + seconds(2);
const directory = path.join(process.cwd(), '.tmp');

const ____note = (msg: string = '') => console.log(chalk.dim(' > ' + msg));

const runTimer = async (name: string, fn: Function) => {
  console.log(chalk.bgWhiteBright.black('======='), name, chalk.bgWhiteBright.black('======='));
  const start = Date.now();
  const result = await fn();
  const end = Date.now();
  if (result !== undefined) console.log(chalk.bgWhite.black('Result:'), result);
  console.log(chalk.bgWhite.black('Timing:'), `Took ${end - start}ms`);
};

const runAll = async () => {
  const entries = Object.entries(examples);
  for (const index in entries) {
    const [name, fn] = entries[index];
    await runTimer(name, fn);
    console.log();
    if (Number(index) < entries.length - 1) {
      console.log(chalk.dim('---------------'));
      console.log();
    }
  }
};

const printExamples = () => {
  console.log(chalk.bgWhiteBright.black(' Available examples: '));
  console.log();
  Object.keys(examples).forEach((name) => {
    console.log('yarn example', name);
  });
  console.log();
};

const main = async () => {
  await fsP.mkdir(directory, { recursive: true });
  console.log();

  if (exampleName === 'help') {
    printExamples();
  } else if (exampleName && examples[exampleName]) {
    await runTimer(exampleName, examples[exampleName]);
    console.log();
  } else {
    await runAll();
  }
};
main();
