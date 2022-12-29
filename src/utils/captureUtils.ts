import path from 'path';

/**
 * Whether a file was saved to the camera or downloaded to the local machine.
 */
export type SaveLocationType = 'camera' | 'local';

/**
 * Information on a file that was saved to the camera or downloaded to the local machine.
 */
export interface SaveLocation {
  /**
   * Whether a file was saved to the camera or downloaded to the local machine.
   */
  type: SaveLocationType;

  /**
   * The directory the file was saved to.
   */
  dir: string;

  /**
   * The filename of the file, including extension.
   */
  filename: string;

  /**
   * The full path to the file.
   */
  full: string;
}
const getDirAndFile = (line: string): { dir: string; filename: string } => {
  const pathOrFile = line.replace(/(New file is in location|Saving file as|Deleting file|Keeping file|on the camera)/g, '').trim();

  const dir = (pathOrFile.match(/(.*[\\\/])*/) || [])[0].replace(/[\\\/]$/, ''); // everything up to last '/' or '\'
  const filename = (pathOrFile.match(/[^\\\/]*$/) || [])[0]; // from last '/' or '\' onwards

  return { dir, filename };
};

export const parseCaptureStdout = (stdout: string, localDir: string): SaveLocation[] => {
  if (!localDir) localDir = process.cwd();

  let savedFiles: SaveLocation[] = [];
  const lines = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length);

  for (let line of lines) {
    const type: SaveLocationType = line.endsWith('on the camera') ? 'camera' : 'local';
    let { dir, filename } = getDirAndFile(line);
    if (type === 'local') dir = localDir;
    const full = path.join(dir, filename);

    if (line.startsWith('New file is in location') || line.startsWith('Saving file as')) {
      savedFiles.push({ type, dir, filename, full });
    }
    if (line.startsWith('Deleting file')) {
      savedFiles = savedFiles.filter((s) => s.filename !== filename && s.type !== type && s.dir !== dir);
    }
  }

  return savedFiles;
};
