import { runCmd } from '../utils/runCmd';
import { readTable } from '../utils/readTable';
import { GPhotoIdentifier } from '../utils/identifiers';

/**
 * Returns a list of connected cameras
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const cameras = await gPhoto.autoDetect();
 *
 * await gPhoto.config.set({ '/main/imgsettings/iso': '2000' }, cameras[0]);
 * await gPhoto.config.set({ '/main/imgsettings/iso': '2500' }, cameras[1]);
 * ```
 */
export const autoDetect = async (): Promise<GPhotoIdentifier[]> => {
  const out = await runCmd('gphoto2 --auto-detect');

  const cameras = readTable<GPhotoIdentifier>(out, ['model', 'port']);

  return cameras;
};
