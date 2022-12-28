/**
 * A collection of functions for managing the configuration of a camera.
 */
export * as config from './commands/config';

export * from './commands/abilities';
export * from './commands/autoDetect';
export * from './commands/listCameras';
export * from './commands/listPorts';
export * from './commands/reset';

export { GPhotoIdentifier } from './utils/identifiers';
export { GPhotoConfigValueObj, GPhotoConfigInfoObj, GPhotoConfigInfo, GPhotoConfigDataType, GPhotoConfigType } from './utils/configUtils';
