import http from 'http';
import { ProcessPromise, runCmdUnqueued } from '../../utils/runCmd';
import { DeferredPromise, getDeferred, seconds, wait } from 'swiss-ak';
import { GPhotoIdentifier } from '../../gPhoto';
import { getIdentifierFlags } from '../../utils/identifiers';
import { GPhotoLiveview, liveviewStore } from '../../utils/liveviewStore';
import { addToQueueSimple } from '../../utils/queue';
import { errorHandling } from '../../utils/errorHandling';
import { checkForWarnings } from '../../utils/logging';

export { GPhotoLiveview };

const ACCEPTABLE_ERRORS = ['connected reset', 'pipe broken'];

const isPortOpen = async (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    let server = http.createServer();
    const handle = (result: boolean) => () => {
      server.close();
      resolve(result);
    };
    server.once('error', handle(false));
    server.once('listening', handle(true));
    server.listen(port);
  });
};
const getRandomPort = (min = 50000, max = 65535) => min + Math.floor(Math.random() * (max - min));
export const getOpenPort = async (port: number = getRandomPort()): Promise<number> => {
  const isOpen = await isPortOpen(port);
  if (isOpen) return port;
  return getOpenPort(port + 1);
};

/**
 * Operate a liveview preview stream from the camera.
 *
 * ```ts
 * const liveview = await gPhoto.capture.liveview(async (frame: Buffer) => {
 *   // do something with the frame; display it, save it, bake it in a pie, whatever
 * }, true);
 *
 * // ...
 *
 * await liveview.stop();
 * ```
 */
export const liveview = async (cb: (frame: Buffer) => void, autoStart: boolean = false, identifier?: GPhotoIdentifier): Promise<GPhotoLiveview> =>
  addToQueueSimple('liveview', identifier, async () => {
    checkForWarnings('liveview', identifier);
    let capture: ProcessPromise<string>;
    let response: http.IncomingMessage;
    let stopPromise: DeferredPromise<void> = null;
    let isKilling: boolean = false; // used to know if we're expecting the process to die/error

    const isRunning = () => !!(capture || response);

    const start = async () => {
      if (isRunning()) {
        await stop();
      }

      const uniqueId = ('0'.repeat(10) + Math.random().toString(36).slice(2)).slice(-10);

      const port = await getOpenPort();
      const url = `http://localhost:${port}/${uniqueId}.jpg`;
      const cmd = `gphoto2 ${getIdentifierFlags(identifier)} --capture-movie --stdout | ffmpeg -re -i pipe:0 -listen 1 -f mjpeg ${url}`;
      try {
        capture = runCmdUnqueued(cmd, undefined, true);

        /*
         * Killing the stream command/process will cause the http.get to throw an error.
         * This is expected and desired behavior, so we catch the error and do nothing.
         * Other errors (e.g. ffmpeg not installed) should be thrown down the line.
         */
        const handleError = async () => {
          capture.process.on('close', () => {
            if (stopPromise) {
              stopPromise.resolve();
            }
          });
          try {
            await capture;
          } catch (err) {
            if (isKilling) {
              return;
            }
            if (ACCEPTABLE_ERRORS.some((e) => err.toLowerCase().includes(e))) {
              return;
            }

            if (errorHandling.handler) {
              const isIgnore = await errorHandling.handler(err, err);
              if (!isIgnore) {
                throw new Error(err);
              }
            } else {
              throw new Error(err);
            }
          }
        };
        handleError();

        const attemptConnection = async () => {
          try {
            await wait(seconds(0.5));

            await new Promise<void>((resolve, reject) => {
              let resolved = false;
              const getter = http.get(url, (res) => {
                res.on('data', (chunk: Buffer) => {
                  cb(chunk);
                  if (!resolved) {
                    response = res;
                    resolved = true;
                    resolve();
                  }
                });
                res.on('error', reject);
              });
              getter.on('error', reject);
            });
          } catch (err) {
            await attemptConnection();
          }
        };
        await attemptConnection();
      } catch (err) {
        // do nothing
      }
    };

    const stop = async () => {
      stopPromise = getDeferred<void>();

      if (capture) {
        try {
          isKilling = true;
          capture.process.disconnect();
          capture.process.kill();
          isKilling = false;
        } catch (err) {
          // do nothing
        }
        capture = undefined;
      }
      if (response) {
        try {
          // response.removeAllListeners();
          response.destroy();
          response = null;
        } catch (err) {
          // do nothing
        }
      }

      await stopPromise.promise; // wait for the process to close

      // TODO run --get-config "something" to force the mirror to close
    };

    const result = { start, stop, isRunning };
    await liveviewStore.add(identifier, result);

    if (autoStart) {
      await start();
    }

    return result;
  });
