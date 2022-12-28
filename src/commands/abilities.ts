import { fn } from 'swiss-ak';
import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';
import { runCmd } from '../utils/runCmd';

/**
 * The abilities of a camera. Returned by gPhoto.abilities()
 *
 * Actual properties may not exactly match this interface, it's just a guide.
 */
export interface GPhotoAbilities {
  model: string;
  serialPortSupport: boolean;
  usbSupport: boolean;
  captureChoices: string[];
  configurationSupport: boolean;
  deleteSelectedFilesOnCamera: boolean;
  deleteAllFilesOnCamera: boolean;
  filePreviewThumbnailSupport: boolean;
  fileUploadSupport: boolean;
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
}

const toCamelCase = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/g)
    .map((word, index) => (index ? fn.capitalise(word) : word))
    .join('');

const keyDictionary = {
  abilitiesForCamera: 'model'
};
const parseKey = (key: string) => {
  if (!key) return key;
  if (keyDictionary[key]) return keyDictionary[key];
  const camel = toCamelCase(key);
  if (keyDictionary[camel]) return keyDictionary[camel];
  return camel;
};
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
  for (let [rawKey, rawValue] of pairs) {
    const key = parseKey(rawKey);
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
 * ```ts
 * import gPhoto from 'gphoto';
 * const abilities = await gPhoto.abilities();
 *
 * console.log(abilities.captureChoices.includes('Image')); // true
 * console.log(abilties.captureChoices.includes('Video')); // false
 * console.log(abilties.deleteSelectedFilesOnCamera); // true
 * ```
 */
export const abilities = async (identifier?: GPhotoIdentifier): Promise<GPhotoAbilities> => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --abilities `);
  return parseAbilitiesTable(out);
};
