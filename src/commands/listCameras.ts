import { runCmdUnqueued } from '../utils/runCmd';

/**
 * Information about a supported camera model.
 */
export interface GPhotoSupportedCamera {
  model: string;
  flag?: string;
}

/**
 * List supported camera models.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const cameras = await gPhoto.listCameras();
 * cameras; // [{ model: 'Canon EOS 5D Mark IV' }, ...]
 * ```
 */
export const listCameras = async (): Promise<GPhotoSupportedCamera[]> => {
  const out = await runCmdUnqueued('gphoto2 --list-cameras');

  const lines = out.split('\n');
  const startIndex = lines.findIndex((line) => line.trim().startsWith('Supported cameras:')) + 1;

  const rows = lines
    .slice(startIndex)
    .map((line) => line.trim().match(/"(.*)"(?: \((.*)\))?/))
    .filter((match) => match)
    .map(([_match, model, flag]) => {
      const result: GPhotoSupportedCamera = { model };
      if (flag) {
        result.flag = flag;
      }
      return result;
    });

  return rows;
};
