import { runCmdUnqueued } from '../utils/runCmd';
import { readTable } from '../utils/readTable';

/**
 * Information about a port listed by `gphoto2 --list-ports`.
 */
export interface GPhotoListedPort {
  path: string;
  description: string;
}

/**
 * List supported port devices.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const ports = await gPhoto.listPorts();
 * ports; // [{ path: 'usb:001,003', description: 'USB PTP Class Camera' }, ...]
 * ```
 */
export const listPorts = async (): Promise<GPhotoListedPort[]> => {
  const out = await runCmdUnqueued('gphoto2 --list-ports');

  const cameras = readTable<GPhotoListedPort>(out, ['path', 'description']);

  return cameras;
};
