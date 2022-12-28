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

/**
 * Possible data types for a config value.
 */
declare type GPhotoConfigDataType = string | number | boolean | Date;
/**
 * Possible types of a config.
 *
 * | Value    | Date Type         | Description                   |
 * | -------- | ----------------- | ----------------------------- |
 * | 'DATE'   | `Date` or `'now'` | A date value                  |
 * | 'MENU'   | `string`          | Has a list of choices         |
 * | 'RADIO'  | `string`          | Has a list of choices         |
 * | 'RANGE'  | `number`          | A number value within a range |
 * | 'TEXT'   | `string`          | A text value                  |
 * | 'TOGGLE' | `boolean`         | An on/off value               |
 */
declare type GPhotoConfigType = 'DATE' | 'MENU' | 'RADIO' | 'RANGE' | 'TEXT' | 'TOGGLE';
/**
 * The information about a configuration option.
 * Contains details on how to display and edit the value.
 */
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
/**
 * A map of config keys to their configuration option info.
 */
interface GPhotoConfigInfoObj {
    [key: string]: GPhotoConfigInfo;
}
/**
 * A map of config keys to their current value.
 */
interface GPhotoConfigValueObj {
    [key: string]: GPhotoConfigDataType;
}

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
declare const list: (identifier?: GPhotoIdentifier) => Promise<string[]>;
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
declare const getAll: (identifier?: GPhotoIdentifier) => Promise<{
    info: GPhotoConfigInfoObj;
    values: GPhotoConfigValueObj;
}>;
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
declare const getAllInfo: (identifier?: GPhotoIdentifier) => Promise<GPhotoConfigInfoObj>;
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
declare const getInfos: (keys: string[], identifier?: GPhotoIdentifier) => Promise<GPhotoConfigInfoObj>;
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
declare const getSingleInfo: (key: string, identifier?: GPhotoIdentifier) => Promise<GPhotoConfigInfo>;
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
declare const getAllValues: (identifier?: GPhotoIdentifier) => Promise<GPhotoConfigValueObj>;
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
declare const get: (keys: string[], identifier?: GPhotoIdentifier) => Promise<GPhotoConfigValueObj>;
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
declare const getSingle: (key: string, identifier?: GPhotoIdentifier) => Promise<GPhotoConfigDataType>;
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
declare const set: (values: {
    [key: string]: GPhotoConfigDataType;
}, identifier?: GPhotoIdentifier) => Promise<void>;
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
declare const setSingle: (key: string, value: GPhotoConfigDataType, identifier?: GPhotoIdentifier) => Promise<void>;

declare const config_list: typeof list;
declare const config_getAll: typeof getAll;
declare const config_getAllInfo: typeof getAllInfo;
declare const config_getInfos: typeof getInfos;
declare const config_getSingleInfo: typeof getSingleInfo;
declare const config_getAllValues: typeof getAllValues;
declare const config_get: typeof get;
declare const config_getSingle: typeof getSingle;
declare const config_set: typeof set;
declare const config_setSingle: typeof setSingle;
declare namespace config {
  export {
    config_list as list,
    config_getAll as getAll,
    config_getAllInfo as getAllInfo,
    config_getInfos as getInfos,
    config_getSingleInfo as getSingleInfo,
    config_getAllValues as getAllValues,
    config_get as get,
    config_getSingle as getSingle,
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
 * import gPhoto from 'gphoto';
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
 * import gPhoto from 'gphoto';
 *
 * const cameras = await gPhoto.autoDetect();
 *
 * await gPhoto.config.set({ '/main/imgsettings/iso': '2000' }, cameras[0]);
 * await gPhoto.config.set({ '/main/imgsettings/iso': '2500' }, cameras[1]);
 * ```
 */
declare const autoDetect: () => Promise<GPhotoIdentifier[]>;

/**
 * Information about a supported camera model.
 */
interface GPhotoSupportedCamera {
    model: string;
    flag?: string;
}
/**
 * List supported camera models.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const cameras = await gPhoto.listCameras();
 * cameras; // [{ model: 'Canon EOS 5D Mark IV' }, ...]
 * ```
 */
declare const listCameras: () => Promise<GPhotoSupportedCamera[]>;

/**
 * Information about a port listed by `gphoto2 --list-ports`.
 */
interface GPhotoListedPort {
    path: string;
    description: string;
}
/**
 * List supported port devices.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const ports = await gPhoto.listPorts();
 * ports; // [{ path: 'usb:001,003', description: 'USB PTP Class Camera' }, ...]
 * ```
 */
declare const listPorts: () => Promise<GPhotoListedPort[]>;

/**
 * Resets the USB port of the camera.
 *
 * This command resets the USB port of the camera.
 * This option is useful if somehow the protocol talking to the camera locked up
 * and simulates plugging out and in the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.reset(); // camera is disconnected and reconnected
 * ```
 */
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
