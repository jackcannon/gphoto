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

// TODO docs
export const getAll = async (identifier?: GPhotoIdentifier): Promise<{ info: GPhotoConfigInfoObj; values: GPhotoConfigValueObj }> => {
  const pairs = await getAllConfigInfoAndValues(identifier);

  const valuesEntries: [string, GPhotoConfigDataType][] = pairs.map(([value, info]) => [info.key, value]);
  const infoEntries: [string, GPhotoConfigInfo][] = pairs.map(([value, info]) => [info.key, info]);

  return {
    info: Object.fromEntries(infoEntries),
    values: Object.fromEntries(valuesEntries)
  };
};

// TODO docs
export const getAllInfos = async (identifier?: GPhotoIdentifier): Promise<GPhotoConfigInfoObj> => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const infoEntries: [string, GPhotoConfigInfo][] = pairs.map(([value, info]) => [info.key, info]);
  return Object.fromEntries(infoEntries);
};

// TODO docs
export const getAllValues = async (identifier?: GPhotoIdentifier): Promise<GPhotoConfigValueObj> => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const valuesEntries: [string, GPhotoConfigDataType][] = pairs.map(([value, info]) => [info.key, value]);
  return Object.fromEntries(valuesEntries);
};

// TODO docs
export const getInfos = async (keys: string[], identifier?: GPhotoIdentifier): Promise<GPhotoConfigInfoObj> => {
  const pairs = await getMultipleConfigInfoAndValues(keys, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, info] as [string, GPhotoConfigInfo]));
};

// TODO docs
// Hint: use getInfos or getAllInfos instead
export const getSingleInfo = async (key: string, identifier?: GPhotoIdentifier): Promise<GPhotoConfigInfo> => {
  const list = await getInfos([key], identifier);
  return list[key];
};

// TODO docs
export const get = async (keys: string[], identifier?: GPhotoIdentifier): Promise<GPhotoConfigValueObj> => {
  const pairs = await getMultipleConfigInfoAndValues(keys, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, value] as [string, GPhotoConfigDataType]));
};

// TODO docs
// Hint: use get or getAllValues instead
export const getSingle = async (key: string, identifier?: GPhotoIdentifier): Promise<GPhotoConfigDataType> => {
  const list = await get([key], identifier);
  return list[key];
};

// TODO docs
export const list = async (identifier?: GPhotoIdentifier): Promise<string[]> => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-config`);
  const lines = out
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length);
  return lines;
};

// TODO docs
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

// TODO docs
// Hint: use set instead
export const setSingle = async (key: string, value: GPhotoConfigDataType, identifier?: GPhotoIdentifier): Promise<void> => {
  await set({ [key]: value }, identifier);
};
