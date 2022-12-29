import { ObjectUtils, zip } from 'swiss-ak';
import { GPhotoConfigInfo } from './configUtils';
import { GPhotoIdentifier } from '../../dist';

const caches = {
  configInfo: new Map<string, Map<string, GPhotoConfigInfo>>(),
  list: new Map<string, string[]>()
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
export const addToConfigInfoCache = (info: GPhotoConfigInfo, identifer: GPhotoIdentifier) => {
  const id = parseID(identifer);
  const store = getInfoStore(id);
  store.set(info.key, info);
};
export const addMultipleToConfigInfoCache = (infos: GPhotoConfigInfo[], identifer: GPhotoIdentifier) => {
  const id = parseID(identifer);
  const store = getInfoStore(id);
  infos.forEach((info) => store.set(info.key, info));
};
export const getFromConfigInfoCache = (key: string, identifer: GPhotoIdentifier): GPhotoConfigInfo => {
  const id = parseID(identifer);
  const store = getInfoStore(id);
  return store.get(key);
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
export const getConfigKeyListFromCache = (identifer: GPhotoIdentifier): string[] => {
  const id = parseID(identifer);
  return caches.list.get(id);
};
export const setConfigKeyListInCache = (list: string[], identifer: GPhotoIdentifier) => {
  const id = parseID(identifer);
  caches.list.set(id, list);
};
