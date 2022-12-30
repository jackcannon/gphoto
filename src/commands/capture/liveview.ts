import http from 'http';
import { ProcessPromise, runCmd, runCmdUnqueued, runCmdWithProcess } from '../../utils/runCmd';
import { DeferredPromise, getDeferred, seconds, wait } from 'swiss-ak';
import { GPhotoIdentifier } from '../../gPhoto';
import { getIdentifierFlags } from '../../utils/identifiers';
import { GPhotoLiveview, liveviewStore } from '../../utils/liveviewStore';
import { addToQueueSimple } from '../../utils/queue';

export { GPhotoLiveview };

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
  addToQueueSimple(identifier, async () => {
    let capture: ProcessPromise<string>;
    let response: http.IncomingMessage;
    let stopPromise: DeferredPromise<void> = null;

    const isRunning = () => !!(capture || response);

    const start = async () => {
      if (isRunning()) {
        await stop();
      }

      const uniqueId = ('0'.repeat(10) + Math.random().toString(36).slice(2)).slice(-10);

      const port = 65535 - 1337 - 420 - 69; // a consistent port that is unlikely to be in use
      const url = `http://localhost:${port}/${uniqueId}.jpg`;
      const cmd = `gphoto2 ${getIdentifierFlags(identifier)} --capture-movie --stdout | ffmpeg -re -i pipe:0 -listen 1 -f mjpeg ${url}`;
      try {
        capture = runCmdUnqueued(cmd);

        /*
         * Killing the stream command/process will cause the http.get to throw an error.
         * This is expected and desired behavior, so we catch the error and do nothing.
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
            // do nothing
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
          capture.process.disconnect();
          capture.process.kill();
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
    };

    const result = { start, stop, isRunning };
    await liveviewStore.add(identifier, result);

    if (autoStart) {
      await start();
    }

    return result;
  });
