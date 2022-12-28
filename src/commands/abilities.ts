import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';
import { runCmd } from '../utils/runCmd';

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

// TODO docs
export const abilities = async (identifier?: GPhotoIdentifier): Promise<GPhotoAbilities> => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --abilities `);
  return parseAbilitiesTable(out);
};
