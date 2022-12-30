import { wait } from 'swiss-ak';
import { runCmd } from '../utils/runCmd';
import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';
import { getIdentifierForSerial, getSerial } from './autoDetect';

/**
 * Resets the USB port of the camera.
 *
 * This command resets the USB port of the camera.
 * This option is useful if somehow the protocol talking to the camera locked up
 * and simulates plugging out and in the camera.
 *
 * Resetting the camera will change the port it is connected to, affecting the `port` property of the `GPhotoIdentifier` object.
 * To maintain consistency, a new `GPhotoIdentifier` object is returned, with an updated `port` property.
 * This is quite a timely operation, so it is recommended to use sparingly.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.reset(); // camera is disconnected and reconnected
 * ```
 */
export const reset = async (identifier?: GPhotoIdentifier): Promise<GPhotoIdentifier> => {
  const serial = await getSerial(identifier);
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --reset`, identifier);
  const result = await getIdentifierForSerial(serial);
  await wait(50);
  return result;
};
