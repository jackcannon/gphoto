/**
 * A collection of functions for managing the configuration of a camera.
 */
export * as config from './commands/config';

/**
 * A collection of functions for capturing files with a camera.
 */
export * as capture from './commands/capture';

/**
 * Controls for the queuing functionality of the library.
 */
export * as queue from './queue-public';

export * from './commands/abilities';
export * from './commands/autoDetect';
export * from './commands/autofocus';
export * from './commands/listCameras';
export * from './commands/listPorts';
export * from './commands/reset';

export { GPhotoLiveview } from './commands/capture/liveview';
export { GPhotoCaptureKeep, GPhotoCaptureOptions } from './commands/capture/options';
export { SaveLocation, SaveLocationType } from './utils/captureUtils';
export { GPhotoIdentifier } from './utils/identifiers';
export { GPhotoConfigValueObj, GPhotoConfigInfoObj, GPhotoConfigInfo, GPhotoConfigDataType, GPhotoConfigType } from './utils/configUtils';
export { GPhotoErrorHandler, setErrorHandler } from './utils/errorHandling';
export { setDebugging } from './utils/debugging';
