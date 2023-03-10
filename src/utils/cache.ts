import { ObjectUtils, zip } from 'swiss-ak';
import { GPhotoConfigInfo } from './configUtils';
import { GPhotoIdentifier } from '../../dist';

const caches = {
  configInfo: new Map<string, Map<string, GPhotoConfigInfo>>(),
  list: new Map<string, string[]>(),
  autoDetect: [] as GPhotoIdentifier[]
};

// GENERAL
const parseID = (identifer: GPhotoIdentifier = {}) => identifer.port || identifer.model || 'auto';

const getInfoStore = (id: string) => {
  const store = caches.configInfo.get(id);
  if (store) return store;
  caches.configInfo.set(id, new Map<string, GPhotoConfigInfo>());
  return caches.configInfo.get(id);
};

// CONFIGINFO
// Used for double-checking when setting config values
export const addToConfigInfoCache = (info: GPhotoConfigInfo, identifer: GPhotoIdentifier) => {
  const id = parseID(identifer);
  const store = getInfoStore(id);
  store.set(info.key, info);
};
export const getMultipleFromConfigInfoCache = (keys: string[], identifer: GPhotoIdentifier): { [key: string]: GPhotoConfigInfo } => {
  const id = parseID(identifer);
  const store = getInfoStore(id);
  return ObjectUtils.clean(
    Object.fromEntries(
      zip(
        keys,
        keys.map((key) => store.get(key))
      )
    )
  );
};

// LIST OF KEYS
// Will never change, so if we have a list for a given camera, we can just use a cached version
export const getConfigKeyListFromCache = (identifer: GPhotoIdentifier): string[] => {
  const id = parseID(identifer);
  return caches.list.get(id);
};
export const setConfigKeyListInCache = (list: string[], identifer: GPhotoIdentifier) => {
  const id = parseID(identifer);
  caches.list.set(id, list);
};

// AUTODETECT
// Cache the autodetect results so we can warn the user if they try to call without an identifier if there's multiple cameras
export const getAutoDetectFromCache = (): GPhotoIdentifier[] => caches.autoDetect;
export const setAutoDetectInCache = (list: GPhotoIdentifier[]) => {
  caches.autoDetect = JSON.parse(JSON.stringify(list));
};
