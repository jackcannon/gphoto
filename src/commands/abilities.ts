import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';
import { runCmd } from '../utils/runCmd';

/**
 * The abilities of a camera. Returned by gPhoto.abilities()
 */
export interface GPhotoAbilities {
  'Abilities for camera': string;
  'Serial port support': boolean;
  'USB support': boolean;
  'Capture choices': string[];
  'Configuration support': boolean;
  'Delete selected files on camera': boolean;
  'Delete all files on camera': boolean;
  'File preview (thumbnail) support': boolean;
  'File upload support': boolean;
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
}

const parseValue = (value: string): string | number | boolean => {
  if (value === '') return undefined;
  if (value === 'yes') return true;
  if (value === 'no') return false;
  if (!Number.isNaN(Number(value))) return Number(value);
  return value;
};

const parseAbilitiesTable = (out: string): GPhotoAbilities => {
  const pairs = out
    .split('\n')
    .filter((line) => line.trim().length)
    .map((line) => line.split(':').map((item) => item.trim()))
    .filter((pair) => pair.length === 2);

  let lastKey = '';
  const result = {};
  for (let [key, rawValue] of pairs) {
    const value = parseValue(rawValue);
    if (key) lastKey = key;
    if (key !== lastKey) {
      if (!(result[lastKey] instanceof Array)) {
        result[lastKey] = [result[lastKey]];
      }
      result[lastKey] = [...result[lastKey], value].filter((v) => v);
    } else {
      result[key] = value;
    }
  }
  return result as GPhotoAbilities;
};

/**
 * Display the camera and driver abilities specified in the libgphoto2 driver.
 * This all does not query the camera, it uses data provided by the libgphoto2 library.
 *
 * @example
 * ```typescript
 * import gPhoto from 'gphoto';
 * const abilities = await gPhoto.abilities();
 * console.log(abilities);
 *
 * // {
 * //   'Abilities for camera': 'Nikon DSC D5200',
 * //   'Serial port support': false,
 * //   'USB support': true,
 * //   'Capture choices': [ 'Image', 'Preview', 'Trigger Capture' ],
 * //   'Configuration support': true,
 * //   'Delete selected files on camera': true,
 * //   'Delete all files on camera': false,
 * //   'File preview (thumbnail) support': true,
 * //   'File upload support': false
 * // }
 *
 * ```
 */
export const abilities = async (identifier?: GPhotoIdentifier): Promise<GPhotoAbilities> => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --abilities `);
  return parseAbilitiesTable(out);
};
