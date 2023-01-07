import { ChildProcess, exec } from 'child_process';
import { GPhotoIdentifier } from './identifiers';
import { addToQueue } from './queue';
import { errorHandling, parseShortErrorMessage } from './errorHandling';

export class ProcessPromise<T = string> extends Promise<T> {
  process: ChildProcess;

  constructor(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => ChildProcess) {
    let process: ChildProcess;
    super((resolve: (value: T) => void, reject: (reason?: any) => void) => {
      process = executor(resolve, reject);
    });

    this.process = process;
  }
}

const ignorableErrors = ['out of focus'];

export const runCmdUnqueued = (cmd: string, dir?: string, skipErrorReporting: boolean = false): ProcessPromise<string> =>
  new ProcessPromise((resolve, reject) =>
    exec(
      cmd,
      {
        cwd: dir || process.cwd()
      },
      async (err, stdout, stderr) => {
        if (err) {
          const shortMsg = parseShortErrorMessage(stderr);

          if (ignorableErrors.includes(shortMsg.toLowerCase())) {
            return resolve('');
          }

          if (!skipErrorReporting && errorHandling.handler) {
            const doResolve = await errorHandling.handler(shortMsg, stderr);
            if (doResolve) {
              return resolve('');
            } else {
              return reject(shortMsg || stderr);
            }
          }

          return reject(shortMsg || stderr);
        }

        return resolve(stdout);
      }
    )
  );

export const runCmd = (cmd: string, identifier: GPhotoIdentifier, dir?: string, skipErrorReporting?: boolean): Promise<string> =>
  addToQueue(cmd, identifier, () => runCmdUnqueued(cmd, dir, skipErrorReporting));

export const runCmdWithProcess = (
  cmd: string,
  identifier: GPhotoIdentifier,
  dir?: string,
  skipErrorReporting?: boolean
): Promise<{
  process: ChildProcess;
  promise: ProcessPromise<string>;
}> =>
  addToQueue(cmd, identifier, async () => {
    const procProm = runCmdUnqueued(cmd, dir, skipErrorReporting);

    return {
      process: procProm.process,
      promise: procProm
    };
  });
