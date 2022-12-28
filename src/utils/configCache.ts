import { ObjectUtils, zip } from 'swiss-ak';
import { GPhotoConfigInfo } from './configUtils';

const configCache = new Map<string, GPhotoConfigInfo>();

export const addToCache = (info: GPhotoConfigInfo) => {
  configCache.set(info.key, info);
};
export const addMultipleToCache = (infos: GPhotoConfigInfo[]) => {
  infos.forEach(addToCache);
};
export const getFromCache = (key: string): GPhotoConfigInfo => {
  return configCache.get(key);
};
export const getMultipleFromCache = (keys: string[]): { [key: string]: GPhotoConfigInfo } => {
  return ObjectUtils.clean(Object.fromEntries(zip(keys, keys.map(getFromCache))));
};
