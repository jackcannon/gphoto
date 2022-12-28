import { runCmd } from '../utils/runCmd';
import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';
import { wrapQuotes } from '../utils/wrapQuotes';
import {
  GPhotoConfigDataType,
  GPhotoConfigInfo,
  GPhotoConfigInfoObj,
  GPhotoConfigValueObj,
  convertValueToString,
  getAllConfigInfoAndValues,
  getMultipleConfigInfoAndValues
} from '../utils/configUtils';
import { getMultipleFromCache } from '../utils/configCache';

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
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-config`);
  const lines = out
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length);
  return lines;
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
 * Get the info for the provided list of configuration options available on the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const info = await gPhoto.config.getInfos([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * info['/main/imgsettings/iso'].readonly; // false
 * ```
 */
export const getInfos = async (keys: string[], identifier?: GPhotoIdentifier): Promise<GPhotoConfigInfoObj> => {
  const pairs = await getMultipleConfigInfoAndValues(keys, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, info] as [string, GPhotoConfigInfo]));
};

/**
 * Get the info for a single configuration option available on the camera.
 *
 * Hint: use ```getInfos``` or ```getAllInfos``` instead if you need to get multiple options at once.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const info = await gPhoto.config.getSingleInfo('/main/imgsettings/iso');
 *
 * info.readonly; // false
 * ```
 */
export const getSingleInfo = async (key: string, identifier?: GPhotoIdentifier): Promise<GPhotoConfigInfo> => {
  const list = await getInfos([key], identifier);
  return list[key];
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
 * Get the values for the provided list of configuration options available on the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const values = await gPhoto.config.get([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * values['/main/imgsettings/iso']; // '100'
 * ```
 */
export const get = async (keys: string[], identifier?: GPhotoIdentifier): Promise<GPhotoConfigValueObj> => {
  const pairs = await getMultipleConfigInfoAndValues(keys, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, value] as [string, GPhotoConfigDataType]));
};

/**
 * Get the value for a single configuration option available on the camera.
 *
 * Hint: use ```get``` or ```getAllValues``` instead if you need to get multiple options at once.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const value = await gPhoto.config.getSingle('/main/imgsettings/iso');
 *
 * value; // '100'
 * ```
 */
export const getSingle = async (key: string, identifier?: GPhotoIdentifier): Promise<GPhotoConfigDataType> => {
  const list = await get([key], identifier);
  return list[key];
};

/**
 * Set values for multiple configuration options on the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.config.getSingle('/main/imgsettings/iso'); // '100'
 *
 * await gPhoto.config.set({
 *   '/main/imgsettings/iso': '200',
 *   '/main/capturesettings/shutterspeed2': '1/100'
 * });
 *
 * await gPhoto.config.getSingle('/main/imgsettings/iso'); // '200'
 * ```
 */
export const set = async (values: { [key: string]: GPhotoConfigDataType }, identifier?: GPhotoIdentifier): Promise<void> => {
  const keys = Object.keys(values);
  const cached = getMultipleFromCache(keys);
  const allInfos = Object.values(cached);
  const missing = keys.filter((key) => !cached[key]);

  if (missing.length) {
    const newInfos = await getInfos(missing, identifier);
    allInfos.push(...Object.values(newInfos));
  }

  const flags = Object.entries(values).map(([key, value]) => {
    const info = allInfos.find((info) => info && info.key === key);
    const valStr = convertValueToString(value, info.type);
    return `--set-config-value ${wrapQuotes(key)}=${wrapQuotes(valStr)}`;
  });
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(' ')}`);
};

/**
 * Set the value of a single configuration option on the camera.
 *
 * Hint: use ```set``` instead if you need to set multiple options at once.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.config.getSingle('/main/imgsettings/iso'); // '100'
 *
 * await gPhoto.config.setSingle('/main/imgsettings/iso', '200');
 *
 * await gPhoto.config.getSingle('/main/imgsettings/iso'); // '200'
 * ```
 */
export const setSingle = async (key: string, value: GPhotoConfigDataType, identifier?: GPhotoIdentifier): Promise<void> => {
  await set({ [key]: value }, identifier);
};
