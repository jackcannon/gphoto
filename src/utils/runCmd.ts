import { ChildProcess, exec } from 'child_process';

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

export const runCmd = (cmd: string): ProcessPromise<string> =>
  new ProcessPromise((resolve, reject) =>
    exec(cmd, {}, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        console.error(stderr);
        return;
      }

      return resolve(stdout);
    })
  );
