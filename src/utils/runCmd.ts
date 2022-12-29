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

export const runCmd = (cmd: string, dir?: string, printStderr: boolean = true): ProcessPromise<string> =>
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
