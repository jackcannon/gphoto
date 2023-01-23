import { SaveLocation, SaveLocationType, parseCaptureStdout } from '../utils/captureUtils';
import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';
import { checkForWarnings } from '../utils/logging';
import { runCmd } from '../utils/runCmd';
import { GPhotoCaptureKeep, GPhotoCaptureOptions, getFlags, getWait } from './capture/options';

export { liveview, GPhotoLiveview } from './capture/liveview';

export { GPhotoCaptureKeep, GPhotoCaptureOptions, SaveLocation, SaveLocationType };

/**
 * Capture an image from the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const files = await gPhoto.capture.image({
 *   download: true,
 *   keep: 'raw',
 *   filename: 'test-%n.%C',
 * });
 * // 'test-1.JPG' saved to current directory
 * // 'DSC_0001.NEF' saved to camera
 *
 * files;
 * // [
 * //   {
 * //     type: 'local',
 * //     dir: '/Users/user/cool-project',
 * //     filename: 'image-1.JPG',
 * //     full: '/Users/user/cool-project/test-1.JPG'
 * //   },
 * //   {
 * //     type: 'camera',
 * //     dir: '/store_00010001/DCIM/100D5200',
 * //     filename: 'DSC_0001.NEF',
 * //     full: '/store_00010001/DCIM/100D5200/DSC_0001.NEF'
 * //   }
 * // ]
 * ```
 */
export const image = async (options: GPhotoCaptureOptions = {}, identifier?: GPhotoIdentifier): Promise<SaveLocation[]> => {
  checkForWarnings('capture.image', identifier);
  const mainFlag = options.download !== false ? '--capture-image-and-download' : '--capture-image';
  const flags = getFlags(options);
  const cmd = `gphoto2 ${getIdentifierFlags(identifier)} ${mainFlag} ${flags} --force-overwrite`;

  await getWait(options);

  const out = await runCmd(cmd, identifier, options.directory);

  return parseCaptureStdout(out, options.directory);
};

/**
 * Capture a quick preview image from the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const files = await gPhoto.capture.preview({
 *   filename: 'preview-%n.%C'
 * });
 * // 'thumb_preview-1.jpg' saved to current directory
 *
 * files;
 * // [
 * //   {
 * //     type: 'local',
 * //     dir: '/Users/user/cool-project',
 * //     filename: 'thumb_preview-1.jpg',
 * //     full: '/Users/user/cool-project/thumb_preview-1.jpg'
 * //   }
 * // ]
 * ```
 */
export const preview = async (options: GPhotoCaptureOptions = {}, identifier?: GPhotoIdentifier): Promise<SaveLocation[]> => {
  checkForWarnings('capture.preview', identifier);
  let opts = options;
  if (options.filename) {
    // Preview images don't support the %C variable, so we replace it with jpg
    opts = { ...options, filename: options.filename.replace(/%C/g, 'jpg') };
  }
  const flags = getFlags(opts);
  const cmd = `gphoto2 ${getIdentifierFlags(identifier)} --capture-preview ${flags} --force-overwrite`;

  await getWait(options);

  const out = await runCmd(cmd, identifier, options.directory);
  return parseCaptureStdout(out, options.directory);
};
