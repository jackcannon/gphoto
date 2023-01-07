import { runCmd } from '../utils/runCmd';
import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';
import { wrapQuotes } from '../utils/wrapQuotes';
import {
  GPhotoConfigDataType,
  GPhotoConfigInfo,
  GPhotoConfigInfoObj,
  GPhotoConfigValueObj,
  convertValueToString,
  filterOutMissingKeys,
  filterOutMissingProps,
  getAllConfigInfoAndValues,
  getMultipleConfigInfoAndValues
} from '../utils/configUtils';
import { getConfigKeyListFromCache, getMultipleFromConfigInfoCache, setConfigKeyListInCache } from '../utils/configCache';

/**
 * Get a list of all the configuration option keys available on the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const keys = await gPhoto.config.list();
 *
 * keys; // ['/main/imgsettings/iso', '/main/capturesettings/shutterspeed2', ...]
 * ```
 */
export const list = async (identifier?: GPhotoIdentifier): Promise<string[]> => {
  const cached = getConfigKeyListFromCache(identifier);
  if (cached) return cached;

  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-config`, identifier);
  const lines = out
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length);

  setConfigKeyListInCache(lines, identifier);

  return lines;
};

/**
 * A function for finding the appropriate config key for a partially known key.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const keys = await gPhoto.config.findAppropriateConfigKeys(['iso', 'shutterspeed2']);
 * keys; // ['/main/imgsettings/iso', '/main/capturesettings/shutterspeed2']
 * ```
 */
export const findAppropriateConfigKeys = async (keys: string[], identifier?: GPhotoIdentifier): Promise<string[]> => {
  const allKeys = await list(identifier);

  return keys.map((key) => {
    if (allKeys.includes(key)) return key;

    const endsWith = allKeys.find((k) => k.endsWith(key));
    if (endsWith) return endsWith;

    const hasAfterSlash = allKeys.find((k) => k.includes('/' + key));
    if (hasAfterSlash) return hasAfterSlash;

    return key;
  });
};

/**
 * Get the info and values for all the configuration options available on the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const {info, values} = await gPhoto.config.getAll();
 *
 * values['/main/imgsettings/iso']; // '100'
 * info['/main/imgsettings/iso'].readonly; // false
 * ```
 */
export const getAll = async (identifier?: GPhotoIdentifier): Promise<{ info: GPhotoConfigInfoObj; values: GPhotoConfigValueObj }> => {
  const pairs = await getAllConfigInfoAndValues(identifier);

  const valuesEntries: [string, GPhotoConfigDataType][] = pairs.map(([value, info]) => [info.key, value]);
  const infoEntries: [string, GPhotoConfigInfo][] = pairs.map(([value, info]) => [info.key, info]);

  return {
    info: Object.fromEntries(infoEntries),
    values: Object.fromEntries(valuesEntries)
  };
};

/**
 * Get the info for all the configuration options available on the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const info = await gPhoto.config.getAllInfo();
 *
 * info['/main/imgsettings/iso'].readonly; // false
 * ```
 */
export const getAllInfo = async (identifier?: GPhotoIdentifier): Promise<GPhotoConfigInfoObj> => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const infoEntries: [string, GPhotoConfigInfo][] = pairs.map(([value, info]) => [info.key, info]);
  return Object.fromEntries(infoEntries);
};

/**
 * Get the values for all the configuration options available on the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const values = await gPhoto.config.getAllValues();
 *
 * values['/main/imgsettings/iso']; // '100'
 * ```
 */
export const getAllValues = async (identifier?: GPhotoIdentifier): Promise<GPhotoConfigValueObj> => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const valuesEntries: [string, GPhotoConfigDataType][] = pairs.map(([value, info]) => [info.key, value]);
  return Object.fromEntries(valuesEntries);
};

/**
 * Get the info and values for the provided list of configuration options available on the camera.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const {info, values} = await gPhoto.config.get([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * values['/main/imgsettings/iso']; // '100'
 * info['/main/imgsettings/iso'].readonly; // false
 * ```
 */
export const get = async (
  keys: string[],
  checkIfMissing: boolean = false,
  identifier?: GPhotoIdentifier
): Promise<{ info: GPhotoConfigInfoObj; values: GPhotoConfigValueObj }> => {
  const checked = await filterOutMissingKeys(identifier, keys, checkIfMissing);
  const pairs = await getMultipleConfigInfoAndValues(checked, identifier);

  const valuesEntries: [string, GPhotoConfigDataType][] = pairs.map(([value, info]) => [info.key, value]);
  const infoEntries: [string, GPhotoConfigInfo][] = pairs.map(([value, info]) => [info.key, info]);

  return {
    info: Object.fromEntries(infoEntries),
    values: Object.fromEntries(valuesEntries)
  };
};

/**
 * Get the info for the provided list of configuration options available on the camera.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const info = await gPhoto.config.getInfo([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * info['/main/imgsettings/iso'].readonly; // false
 * ```
 */
export const getInfo = async (keys: string[], checkIfMissing: boolean = false, identifier?: GPhotoIdentifier): Promise<GPhotoConfigInfoObj> => {
  const checked = await filterOutMissingKeys(identifier, keys, checkIfMissing);
  const pairs = await getMultipleConfigInfoAndValues(checked, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, info] as [string, GPhotoConfigInfo]));
};

/**
 * Get the values for the provided list of configuration options available on the camera.
 * Returns an object with the keys being the config keys and the values being the config values.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const values = await gPhoto.config.getValuesAsObj([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * values['/main/imgsettings/iso']; // '100'
 *
 * const {['/main/imgsettings/iso'] as iso} = values;
 * iso; // '100'
 * ```
 */
export const getValuesAsObj = async (
  keys: string[],
  checkIfMissing: boolean = false,
  identifier?: GPhotoIdentifier
): Promise<GPhotoConfigValueObj> => {
  const checked = await filterOutMissingKeys(identifier, keys, checkIfMissing);
  const pairs = await getMultipleConfigInfoAndValues(checked, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, value] as [string, GPhotoConfigDataType]));
};

/**
 * Get the values for the provided list of configuration options available on the camera.
 * Returns an array with the values in the same order as the keys provided. Values for invalid keys will be `undefined`.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const values = await gPhoto.config.getValues([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * values[0]; // '100'
 *
 * const [iso] = values;
 * iso; // '100'
 * ```
 */
export const getValues = async (keys: string[], checkIfMissing: boolean = false, identifier?: GPhotoIdentifier): Promise<GPhotoConfigDataType[]> => {
  const valuesObj = await getValuesAsObj(keys, checkIfMissing, identifier);
  return keys.map((key) => valuesObj[key]);
};

/**
 * Set values for multiple configuration options on the camera.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.config.getValues(['/main/imgsettings/iso']); // ['100']
 *
 * await gPhoto.config.setValues({
 *   '/main/imgsettings/iso': '200',
 *   '/main/capturesettings/shutterspeed2': '1/100'
 * });
 *
 * await gPhoto.config.getValues(['/main/imgsettings/iso']); // ['200']
 * ```
 */
export const setValues = async (
  values: { [key: string]: GPhotoConfigDataType },
  checkIfMissing: boolean = false,
  identifier?: GPhotoIdentifier
): Promise<void> => {
  const checked = await filterOutMissingProps(identifier, values, checkIfMissing);

  const keys = Object.keys(checked);
  const cached = getMultipleFromConfigInfoCache(keys, identifier);
  const allInfos = Object.values(cached);
  const missing = keys.filter((key) => !cached[key]);

  if (missing.length) {
    const newInfos = await getInfo(missing, false, identifier);
    allInfos.push(...Object.values(newInfos));
  }

  const flags = Object.entries(checked).map(([key, value]) => {
    const info = allInfos.find((info) => info && info.key === key);
    const valStr = convertValueToString(value, info.type);
    return `--set-config-value ${wrapQuotes(key)}=${wrapQuotes(valStr)}`;
  });
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(' ')}`, identifier);
};
