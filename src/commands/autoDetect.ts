import { runCmdUnqueued } from '../utils/runCmd';
import { readTable } from '../utils/readTable';
import { GPhotoIdentifier } from '../utils/identifiers';
import * as config from './config';
import { PromiseUtils } from 'swiss-ak';

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
  const out = await runCmdUnqueued('gphoto2 --auto-detect');

  const cameras = readTable<GPhotoIdentifier>(out, ['model', 'port']);

  return cameras;
};

/**
 * Get the serial number of a camera
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const serial = await gPhoto.getSerial();
 * serial; // 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
 * ```
 */
export const getSerial = async (identifier?: GPhotoIdentifier): Promise<string> => {
  const [serial] = await config.getValues(['serialnumber'], false, identifier);
  return serial as string;
};

/**
 * Returns a list of connected cameras, with their respective serial numbers
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const cameras = await gPhoto.autoDetectWithSerials();
 * cameras[0].serial; // 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
 * ```
 */
export const autoDetectWithSerials = async (): Promise<GPhotoIdentifier[]> => {
  const cameras = await autoDetect();

  return PromiseUtils.mapLimit(4, cameras, async (camera) => {
    const serial = await getSerial(camera);
    return { ...camera, serial };
  });
};

/**
 * Get the identifier for a camera with a given serial number
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const serial = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
 * const identifier = await gPhoto.getIdentifierForSerial(serial);
 * identifier.port; // 'usb:XXX,XXX'
 * ```
 */
export const getIdentifierForSerial = async (serial: string): Promise<GPhotoIdentifier> => {
  const cameras = await autoDetectWithSerials();
  const camera = cameras.find((camera) => camera.serial === serial);
  return camera;
};
