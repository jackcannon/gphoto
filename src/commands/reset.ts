import { wait } from 'swiss-ak';
import { runCmd } from '../utils/runCmd';
import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';

/**
 * Resets the USB port of the camera.
 *
 * This command resets the USB port of the camera.
 * This option is useful if somehow the protocol talking to the camera locked up
 * and simulates plugging out and in the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.reset(); // camera is disconnected and reconnected
 * ```
 */
export const reset = async (identifier?: GPhotoIdentifier): Promise<void> => {
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --reset`);
  await wait(0);
};
