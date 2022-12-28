/**
 * Used to identify/specify a camera. Useful if there are multiple cameras connected.
 *
 * From the gphoto2 docs:
 * > if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.
 */
interface GPhotoIdentifier {
    /**
     * The ```port``` value of the camera.
     */
    port?: string;
    /**
     * From the gphoto2 docs:
     * > if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.
     */
    model?: string;
}

declare type GPhotoConfigDataType = string | number | boolean | Date;
declare type GPhotoConfigType = 'DATE' | 'MENU' | 'RADIO' | 'RANGE' | 'TEXT' | 'TOGGLE';
interface GPhotoConfigInfo {
    key: string;
    label: string;
    readonly: boolean;
    type: GPhotoConfigType;
    choices?: string[];
    /**
     * Only for RANGE
     */
    min?: number;
    /**
     * Only for RANGE
     */
    max?: number;
    /**
     * Only for RANGE
     */
    step?: number;
    /**
     * Some configs provide help text
     */
    help?: string;
}
interface GPhotoConfigInfoObj {
    [key: string]: GPhotoConfigInfo;
}
interface GPhotoConfigValueObj {
    [key: string]: GPhotoConfigDataType;
}

declare const getAll: (identifier?: GPhotoIdentifier) => Promise<{
    info: GPhotoConfigInfoObj;
    values: GPhotoConfigValueObj;
}>;
declare const getAllInfos: (identifier?: GPhotoIdentifier) => Promise<GPhotoConfigInfoObj>;
declare const getAllValues: (identifier?: GPhotoIdentifier) => Promise<GPhotoConfigValueObj>;
declare const getInfos: (keys: string[], identifier?: GPhotoIdentifier) => Promise<GPhotoConfigInfoObj>;
declare const getSingleInfo: (key: string, identifier?: GPhotoIdentifier) => Promise<GPhotoConfigInfo>;
declare const get: (keys: string[], identifier?: GPhotoIdentifier) => Promise<GPhotoConfigValueObj>;
declare const getSingle: (key: string, identifier?: GPhotoIdentifier) => Promise<GPhotoConfigDataType>;
declare const list: (identifier?: GPhotoIdentifier) => Promise<string[]>;
declare const set: (values: {
    [key: string]: GPhotoConfigDataType;
}, identifier?: GPhotoIdentifier) => Promise<void>;
declare const setSingle: (key: string, value: GPhotoConfigDataType, identifier?: GPhotoIdentifier) => Promise<void>;

declare const config_getAll: typeof getAll;
declare const config_getAllInfos: typeof getAllInfos;
declare const config_getAllValues: typeof getAllValues;
declare const config_getInfos: typeof getInfos;
declare const config_getSingleInfo: typeof getSingleInfo;
declare const config_get: typeof get;
declare const config_getSingle: typeof getSingle;
declare const config_list: typeof list;
declare const config_set: typeof set;
declare const config_setSingle: typeof setSingle;
declare namespace config {
  export {
    config_getAll as getAll,
    config_getAllInfos as getAllInfos,
    config_getAllValues as getAllValues,
    config_getInfos as getInfos,
    config_getSingleInfo as getSingleInfo,
    config_get as get,
    config_getSingle as getSingle,
    config_list as list,
    config_set as set,
    config_setSingle as setSingle,
  };
}

/**
 * The abilities of a camera. Returned by gPhoto.abilities()
 *
 * Actual properties may not exactly match this interface, it's just a guide.
 */
interface GPhotoAbilities {
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
/**
 * Display the camera and driver abilities specified in the libgphoto2 driver.
 * This all does not query the camera, it uses data provided by the libgphoto2 library.
 *
 * ```ts
 * import * as gPhoto from 'gphoto';
 * const abilities = await gPhoto.abilities();
 *
 * console.log(abilities.captureChoices.includes('Image')); // true
 * console.log(abilties.captureChoices.includes('Video')); // false
 * console.log(abilties.deleteSelectedFilesOnCamera); // true
 * ```
 */
declare const abilities: (identifier?: GPhotoIdentifier) => Promise<GPhotoAbilities>;

/**
 * Returns a list of connected cameras
 *
 * ```ts
 * import {autoDetect} from 'gphoto';
 *
 * const cameras = await autoDetect();
 * ```
 */
declare const autoDetect: () => Promise<GPhotoIdentifier[]>;

interface GPhotoSupportedCamera {
    model: string;
    flag?: string;
}
declare const listCameras: () => Promise<GPhotoSupportedCamera[]>;

interface GPhotoListedPort {
    path: string;
    description: string;
}
declare const listPorts: () => Promise<GPhotoListedPort[]>;

declare const reset: (identifier?: GPhotoIdentifier) => Promise<void>;

/**
 * A collection of functions for managing the configuration of a camera.
 */

declare const gPhoto_config: typeof config;
type gPhoto_GPhotoIdentifier = GPhotoIdentifier;
type gPhoto_GPhotoConfigValueObj = GPhotoConfigValueObj;
type gPhoto_GPhotoConfigInfoObj = GPhotoConfigInfoObj;
type gPhoto_GPhotoConfigInfo = GPhotoConfigInfo;
type gPhoto_GPhotoConfigDataType = GPhotoConfigDataType;
type gPhoto_GPhotoConfigType = GPhotoConfigType;
type gPhoto_GPhotoAbilities = GPhotoAbilities;
declare const gPhoto_abilities: typeof abilities;
declare const gPhoto_autoDetect: typeof autoDetect;
type gPhoto_GPhotoSupportedCamera = GPhotoSupportedCamera;
declare const gPhoto_listCameras: typeof listCameras;
type gPhoto_GPhotoListedPort = GPhotoListedPort;
declare const gPhoto_listPorts: typeof listPorts;
declare const gPhoto_reset: typeof reset;
declare namespace gPhoto {
  export {
    gPhoto_config as config,
    gPhoto_GPhotoIdentifier as GPhotoIdentifier,
    gPhoto_GPhotoConfigValueObj as GPhotoConfigValueObj,
    gPhoto_GPhotoConfigInfoObj as GPhotoConfigInfoObj,
    gPhoto_GPhotoConfigInfo as GPhotoConfigInfo,
    gPhoto_GPhotoConfigDataType as GPhotoConfigDataType,
    gPhoto_GPhotoConfigType as GPhotoConfigType,
    gPhoto_GPhotoAbilities as GPhotoAbilities,
    gPhoto_abilities as abilities,
    gPhoto_autoDetect as autoDetect,
    gPhoto_GPhotoSupportedCamera as GPhotoSupportedCamera,
    gPhoto_listCameras as listCameras,
    gPhoto_GPhotoListedPort as GPhotoListedPort,
    gPhoto_listPorts as listPorts,
    gPhoto_reset as reset,
  };
}

export { GPhotoAbilities, GPhotoConfigDataType, GPhotoConfigInfo, GPhotoConfigInfoObj, GPhotoConfigType, GPhotoConfigValueObj, GPhotoIdentifier, GPhotoListedPort, GPhotoSupportedCamera, abilities, autoDetect, config, gPhoto as default, listCameras, listPorts, reset };
