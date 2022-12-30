import { ChildProcess, exec } from 'child_process';
import { GPhotoIdentifier } from './identifiers';
import { addToQueue } from './queue';

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

export const runCmdUnqueued = (cmd: string, dir?: string, printStderr: boolean = false): ProcessPromise<string> =>
  new ProcessPromise((resolve, reject) =>
    exec(
      cmd,
      {
        cwd: dir || process.cwd()
      },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
          if (printStderr) console.error(stderr);
          return;
        }

        return resolve(stdout);
      }
    )
  );

export const runCmd = (cmd: string, identifier: GPhotoIdentifier, dir?: string, printStderr?: boolean): Promise<string> =>
  addToQueue(identifier, () => runCmdUnqueued(cmd, dir, printStderr));

export const runCmdWithProcess = (
  cmd: string,
  identifier: GPhotoIdentifier,
  dir?: string,
  printStderr?: boolean
): Promise<{
  process: ChildProcess;
  promise: ProcessPromise<string>;
}> =>
  addToQueue(identifier, async () => {
    const procProm = runCmdUnqueued(cmd, dir, printStderr);

    return {
      process: procProm.process,
      promise: procProm
    };
  });
