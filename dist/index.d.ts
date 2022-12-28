/**
 * Used to specify a camera to use.
 *
 * Note that if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.
 */
interface GPhotoIdentifier {
    port?: string;
    /**
     * Note that if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.
     */
    model?: string;
}

/**
 * The abilities of a camera. Returned by gPhoto.abilities()
 */
interface GPhotoAbilities {
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
/**
 * Display the camera and driver abilities specified in the libgphoto2 driver.
 * This all does not query the camera, it uses data provided by the libgphoto2 library.
 *
 * @example
 * ```typescript
 * import gPhoto from 'gphoto';
 * const abilities = await gPhoto.abilities();
 * console.log(abilities);
 *
 * // {
 * //   'Abilities for camera': 'Nikon DSC D5200',
 * //   'Serial port support': false,
 * //   'USB support': true,
 * //   'Capture choices': [ 'Image', 'Preview', 'Trigger Capture' ],
 * //   'Configuration support': true,
 * //   'Delete selected files on camera': true,
 * //   'Delete all files on camera': false,
 * //   'File preview (thumbnail) support': true,
 * //   'File upload support': false
 * // }
 *
 * ```
 */
declare const abilities: (identifier?: GPhotoIdentifier) => Promise<GPhotoAbilities>;

interface GPhotoAutoDetectCamera {
    model: string;
    port: string;
}
declare const autoDetect: () => Promise<GPhotoAutoDetectCamera[]>;

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

export { GPhotoAbilities, abilities, autoDetect, config, listCameras, listPorts, reset };
