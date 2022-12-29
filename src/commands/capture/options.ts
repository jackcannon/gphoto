import { YEAR, fn, waitFor, waitUntil } from 'swiss-ak';
import { wrapQuotes } from '../../utils/wrapQuotes';

/**
 * Used GPhotoCaptureOptions.keep
 *
 * | Value   | Description                                                                                             |
 * | ------- | ------------------------------------------------------------------------------------------------------- |
 * | `true`  | Keep the images on the memory card of the camera.                                                       |
 * | `false` | Don't keep the images on the memory card of the camera after downloading them during capture. (default) |
 * | `'raw'` | Keep the RAW images on the memory card of the camera, but still download the JPEG images.               |
 */
export type GPhotoCaptureKeep = boolean | 'raw';

/**
 * Options for capture commands
 */
export interface GPhotoCaptureOptions {
  /**
   * Whether to download the file after capturing it.
   *
   * Default: `true`
   */
  download?: boolean;

  /**
   * Where to download the file to. Runs the command from this directory.
   *
   * Default: `process.cwd()`
   */
  directory?: string;

  /**
   * When downloading files from the camera, specify the file name or file name pattern to use when storing the downloaded file on the local disk.
   *
   * You can include the following variables:
   *
   * | Variable | Description                                                                 |
   * | -------- | --------------------------------------------------------------------------- |
   * | `%n`     | A iterating number. Also see `filenumber`                                   |
   * | `%03n`   | Same as `%n` above, but padded to be 3 wide. e.g. `007`. Num can be changed |
   * | `%C`     | The native file extension (e.g. `JPG` or `NEF`)                             |
   * | `%a`     | locale's abbreviated weekday name (e.g., Sun)                               |
   * | `%A`     | locale's full weekday name (e.g., Sunday)                                   |
   * | `%b`     | locale's abbreviated month name (e.g., Jan)                                 |
   * | `%B`     | locale's full month name (e.g., January)                                    |
   * | `%d`     | day of month (e.g., 01)                                                     |
   * | `%H`     | hour (00..23)                                                               |
   * | `%I`     | hour (01..12)                                                               |
   * | `%j`     | day of year (001..366)                                                      |
   * | `%k`     | hour, space padded ( 0..23); same as %\_H                                   |
   * | `%l`     | hour, space padded ( 1..12); same as %\_I                                   |
   * | `%m`     | month (01..12)                                                              |
   * | `%M`     | minute (00..59)                                                             |
   * | `%S`     | second (00..60)                                                             |
   * | `%y`     | last two digits of year (00..99)                                            |
   * | `%%`     | a literal `%` character                                                     |
   */
  filename?: string;

  /**
   * If you specify the filename using the `filename` option and use the `%n` pattern, this pattern usually starts at 1.
   * For incremental usage, you can use `filenumber` to have it start at another number
   */
  filenumber?: number;

  /**
   * Used for --capture-image-and-download or interval capture
   *
   * | Value   | Description                                                                                             |
   * | ------- | ------------------------------------------------------------------------------------------------------- |
   * | `true`  | Keep the images on the memory card of the camera.                                                       |
   * | `false` | Don't keep the images on the memory card of the camera after downloading them during capture. (default) |
   * | `'raw'` | Keep the RAW images on the memory card of the camera, but still download the JPEG images.               |
   */
  keep?: GPhotoCaptureKeep;
  /**
   * Bulb mode long-exposure captures. Time in milliseconds.
   *
   * This option may not be supported by all cameras or all versions of gphoto2
   */
  bulb?: number;

  /**
   * Number of frames to capture in one run. Default is infinite number of frames.
   */
  frames?: number;

  /**
   * Time between capture of multiple frames. Time in milliseconds.
   */
  interval?: number;

  /**
   * Only get not already downloaded files.
   *
   * This option depends on camera support of flagging already downloaded images and is not available for all drivers.
   */
  onlyNew?: boolean;

  /**
   * Skip files if they exist already on the local directory.
   */
  skipExisting?: boolean;

  /**
   * Wait for a certain amount of time before capturing the image.
   *
   * Time in milliseconds.
   *
   * If value is longer than 1 Year (31557600000), it will be interpreted as a target Unix timestamp, and the command will wait until that time.
   */
  wait?: number;
}

export const getFlags = (options: GPhotoCaptureOptions) => {
  const flags = [];

  if (options.filename) flags.push(`--filename=${wrapQuotes(options.filename)}`);
  if (options.filenumber) flags.push(`--filenumber=${options.filenumber}`);

  if (options.download !== false && options.keep !== undefined) {
    if (options.keep === true) flags.push(`--keep`);
    if (options.keep === false) flags.push(`--no-keep`);
    if (options.keep === 'raw') flags.push(`--keep-raw`);
  }

  if (options.bulb) flags.push(`--bulb=${fn.fixFloat(options.bulb / 1000)}`);
  if (options.frames) flags.push(`--frames=${options.frames}`);
  if (options.interval) flags.push(`--interval=${fn.fixFloat(options.interval / 1000)}`);

  if (options.onlyNew) flags.push(`--new`);
  if (options.skipExisting) flags.push(`--skip-existing`);

  return flags.join(' ');
};

export const getWait = async (options: GPhotoCaptureOptions) => {
  if (options.wait) {
    if (options.wait > YEAR) {
      await waitUntil(options.wait);
    } else {
      await waitFor(options.wait);
    }
  }
};
