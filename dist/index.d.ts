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
    /**
     * The serial number of the camera. Unique to each camera.
     * Only present when using `autoDetectWithSerials()`.
     */
    serial?: string;
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
 * A function for finding the appropriate config key for a partially known key.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const keys = await gPhoto.config.findAppropriateConfigKeys(['iso', 'shutterspeed2']);
 * keys; // ['/main/imgsettings/iso', '/main/capturesettings/shutterspeed2']
 * ```
 */
declare const findAppropriateConfigKeys: (keys: string[], identifier?: GPhotoIdentifier) => Promise<string[]>;
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
 * Get the info and values for the provided list of configuration options available on the camera.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const {info, values} = await gPhoto.config.get([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * values['/main/imgsettings/iso']; // '100'
 * info['/main/imgsettings/iso'].readonly; // false
 * ```
 */
declare const get: (keys: string[], checkIfMissing?: boolean, identifier?: GPhotoIdentifier) => Promise<{
    info: GPhotoConfigInfoObj;
    values: GPhotoConfigValueObj;
}>;
/**
 * Get the info for the provided list of configuration options available on the camera.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const info = await gPhoto.config.getInfo([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * info['/main/imgsettings/iso'].readonly; // false
 * ```
 */
declare const getInfo: (keys: string[], checkIfMissing?: boolean, identifier?: GPhotoIdentifier) => Promise<GPhotoConfigInfoObj>;
/**
 * Get the values for the provided list of configuration options available on the camera.
 * Returns an object with the keys being the config keys and the values being the config values.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const values = await gPhoto.config.getValuesAsObj([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * values['/main/imgsettings/iso']; // '100'
 *
 * const {['/main/imgsettings/iso'] as iso} = values;
 * iso; // '100'
 * ```
 */
declare const getValuesAsObj: (keys: string[], checkIfMissing?: boolean, identifier?: GPhotoIdentifier) => Promise<GPhotoConfigValueObj>;
/**
 * Get the values for the provided list of configuration options available on the camera.
 * Returns an array with the values in the same order as the keys provided. Values for invalid keys will be `undefined`.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const values = await gPhoto.config.getValues([
 *   '/main/imgsettings/iso',
 *   '/main/capturesettings/shutterspeed2'
 * ]);
 *
 * values[0]; // '100'
 *
 * const [iso] = values;
 * iso; // '100'
 * ```
 */
declare const getValues: (keys: string[], checkIfMissing?: boolean, identifier?: GPhotoIdentifier) => Promise<GPhotoConfigDataType[]>;
/**
 * Set values for multiple configuration options on the camera.
 *
 * If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.config.getValues(['/main/imgsettings/iso']); // ['100']
 *
 * await gPhoto.config.setValues({
 *   '/main/imgsettings/iso': '200',
 *   '/main/capturesettings/shutterspeed2': '1/100'
 * });
 *
 * await gPhoto.config.getValues(['/main/imgsettings/iso']); // ['200']
 * ```
 */
declare const setValues: (values: {
    [key: string]: GPhotoConfigDataType;
}, checkIfMissing?: boolean, identifier?: GPhotoIdentifier) => Promise<void>;

declare const config_list: typeof list;
declare const config_findAppropriateConfigKeys: typeof findAppropriateConfigKeys;
declare const config_getAll: typeof getAll;
declare const config_getAllInfo: typeof getAllInfo;
declare const config_getAllValues: typeof getAllValues;
declare const config_get: typeof get;
declare const config_getInfo: typeof getInfo;
declare const config_getValuesAsObj: typeof getValuesAsObj;
declare const config_getValues: typeof getValues;
declare const config_setValues: typeof setValues;
declare namespace config {
  export {
    config_list as list,
    config_findAppropriateConfigKeys as findAppropriateConfigKeys,
    config_getAll as getAll,
    config_getAllInfo as getAllInfo,
    config_getAllValues as getAllValues,
    config_get as get,
    config_getInfo as getInfo,
    config_getValuesAsObj as getValuesAsObj,
    config_getValues as getValues,
    config_setValues as setValues,
  };
}

/**
 * Whether a file was saved to the camera or downloaded to the local machine.
 */
declare type SaveLocationType = 'camera' | 'local';
/**
 * Information on a file that was saved to the camera or downloaded to the local machine.
 */
interface SaveLocation {
    /**
     * Whether a file was saved to the camera or downloaded to the local machine.
     */
    type: SaveLocationType;
    /**
     * The directory the file was saved to.
     */
    dir: string;
    /**
     * The filename of the file, including extension.
     */
    filename: string;
    /**
     * The full path to the file.
     */
    full: string;
}

/**
 * Used GPhotoCaptureOptions.keep
 *
 * | Value   | Description                                                                                             |
 * | ------- | ------------------------------------------------------------------------------------------------------- |
 * | `true`  | Keep the images on the memory card of the camera.                                                       |
 * | `false` | Don't keep the images on the memory card of the camera after downloading them during capture. (default) |
 * | `'raw'` | Keep the RAW images on the memory card of the camera, but still download the JPEG images.               |
 */
declare type GPhotoCaptureKeep = boolean | 'raw';
/**
 * Options for capture commands
 */
interface GPhotoCaptureOptions {
    /**
     * Whether to download the file after capturing it.
     *
     * Default: `true`
     */
    download?: boolean;
    /**
     * Where to download the file to. Runs the command from this directory.
     *
     * Default: `process.cwd()`
     */
    directory?: string;
    /**
     * When downloading files from the camera, specify the file name or file name pattern to use when storing the downloaded file on the local disk.
     *
     * You can include the following variables:
     *
     * | Variable | Description                                                                 |
     * | -------- | --------------------------------------------------------------------------- |
     * | `%n`     | A iterating number. Also see `filenumber`                                   |
     * | `%03n`   | Same as `%n` above, but padded to be 3 wide. e.g. `007`. Num can be changed |
     * | `%C`     | The native file extension (e.g. `JPG` or `NEF`)                             |
     * | `%a`     | locale's abbreviated weekday name (e.g., Sun)                               |
     * | `%A`     | locale's full weekday name (e.g., Sunday)                                   |
     * | `%b`     | locale's abbreviated month name (e.g., Jan)                                 |
     * | `%B`     | locale's full month name (e.g., January)                                    |
     * | `%d`     | day of month (e.g., 01)                                                     |
     * | `%H`     | hour (00..23)                                                               |
     * | `%I`     | hour (01..12)                                                               |
     * | `%j`     | day of year (001..366)                                                      |
     * | `%k`     | hour, space padded ( 0..23); same as %\_H                                   |
     * | `%l`     | hour, space padded ( 1..12); same as %\_I                                   |
     * | `%m`     | month (01..12)                                                              |
     * | `%M`     | minute (00..59)                                                             |
     * | `%S`     | second (00..60)                                                             |
     * | `%y`     | last two digits of year (00..99)                                            |
     * | `%%`     | a literal `%` character                                                     |
     */
    filename?: string;
    /**
     * If you specify the filename using the `filename` option and use the `%n` pattern, this pattern usually starts at 1.
     * For incremental usage, you can use `filenumber` to have it start at another number
     */
    filenumber?: number;
    /**
     * Used for --capture-image-and-download or interval capture
     *
     * | Value   | Description                                                                                             |
     * | ------- | ------------------------------------------------------------------------------------------------------- |
     * | `true`  | Keep the images on the memory card of the camera.                                                       |
     * | `false` | Don't keep the images on the memory card of the camera after downloading them during capture. (default) |
     * | `'raw'` | Keep the RAW images on the memory card of the camera, but still download the JPEG images.               |
     */
    keep?: GPhotoCaptureKeep;
    /**
     * Bulb mode long-exposure captures. Time in milliseconds.
     *
     * This option may not be supported by all cameras or all versions of gphoto2
     */
    bulb?: number;
    /**
     * Number of frames to capture in one run. Default is infinite number of frames.
     */
    frames?: number;
    /**
     * Time between capture of multiple frames. Time in milliseconds.
     */
    interval?: number;
    /**
     * Only get not already downloaded files.
     *
     * This option depends on camera support of flagging already downloaded images and is not available for all drivers.
     */
    onlyNew?: boolean;
    /**
     * Skip files if they exist already on the local directory.
     */
    skipExisting?: boolean;
    /**
     * Wait for a certain amount of time before capturing the image.
     *
     * Time in milliseconds.
     *
     * If value is longer than 1 Year (31557600000), it will be interpreted as a target Unix timestamp, and the command will wait until that time.
     */
    wait?: number;
}

/**
 * A liveview stream with methods for starting and stopping the stream.
 */
interface GPhotoLiveview {
    /**
     * Start the liveview stream.
     *
     * Not needed if `autoStart` is `true`.
     */
    start: () => Promise<void>;
    /**
     * Stop the stream
     */
    stop: () => Promise<void>;
    /**
     * Whether the stream is currently running.
     */
    isRunning: () => boolean;
}

/**
 * Operate a liveview preview stream from the camera.
 *
 * ```ts
 * const liveview = await gPhoto.capture.liveview(async (frame: Buffer) => {
 *   // do something with the frame; display it, save it, bake it in a pie, whatever
 * }, true);
 *
 * // ...
 *
 * await liveview.stop();
 * ```
 */
declare const liveview: (cb: (frame: Buffer) => void, autoStart?: boolean, identifier?: GPhotoIdentifier) => Promise<GPhotoLiveview>;

/**
 * Capture an image from the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const files = await gPhoto.capture.image({
 *   download: true,
 *   keep: 'raw',
 *   filename: 'test-%n.%C',
 * });
 * // 'test-1.JPG' saved to current directory
 * // 'DSC_0001.NEF' saved to camera
 *
 * files;
 * // [
 * //   {
 * //     type: 'local',
 * //     dir: '/Users/user/cool-project',
 * //     filename: 'image-1.JPG',
 * //     full: '/Users/user/cool-project/test-1.JPG'
 * //   },
 * //   {
 * //     type: 'camera',
 * //     dir: '/store_00010001/DCIM/100D5200',
 * //     filename: 'DSC_0001.NEF',
 * //     full: '/store_00010001/DCIM/100D5200/DSC_0001.NEF'
 * //   }
 * // ]
 * ```
 */
declare const image: (options?: GPhotoCaptureOptions, identifier?: GPhotoIdentifier) => Promise<SaveLocation[]>;
/**
 * Capture a quick preview image from the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const files = await gPhoto.capture.preview({
 *   filename: 'preview-%n.%C'
 * });
 * // 'thumb_preview-1.jpg' saved to current directory
 *
 * files;
 * // [
 * //   {
 * //     type: 'local',
 * //     dir: '/Users/user/cool-project',
 * //     filename: 'thumb_preview-1.jpg',
 * //     full: '/Users/user/cool-project/thumb_preview-1.jpg'
 * //   }
 * // ]
 * ```
 */
declare const preview: (options?: GPhotoCaptureOptions, identifier?: GPhotoIdentifier) => Promise<SaveLocation[]>;

type capture_GPhotoCaptureKeep = GPhotoCaptureKeep;
type capture_GPhotoCaptureOptions = GPhotoCaptureOptions;
type capture_SaveLocation = SaveLocation;
type capture_SaveLocationType = SaveLocationType;
declare const capture_image: typeof image;
declare const capture_preview: typeof preview;
declare const capture_liveview: typeof liveview;
type capture_GPhotoLiveview = GPhotoLiveview;
declare namespace capture {
  export {
    capture_GPhotoCaptureKeep as GPhotoCaptureKeep,
    capture_GPhotoCaptureOptions as GPhotoCaptureOptions,
    capture_SaveLocation as SaveLocation,
    capture_SaveLocationType as SaveLocationType,
    capture_image as image,
    capture_preview as preview,
    capture_liveview as liveview,
    capture_GPhotoLiveview as GPhotoLiveview,
  };
}

/**
 * Enable the queuing functionality. This is enabled by default.
 */
declare const enable: () => void;
/**
 * Disable the queuing functionality. It is enabled by default.
 */
declare const disable: () => void;
/**
 * Whether the queuing functionality is enabled.
 */
declare const isQueueEnabled: () => boolean;
/**
 * Enable the management of liveview streams.
 *
 * This stops the liveview stream before a command is executed and starts it again after the command is executed.
 *
 * This is enabled by default.
 */
declare const enableLiveviewManagement: () => void;
/**
 * Disable the management of liveview streams.
 *
 * This stops the liveview stream before a command is executed and starts it again after the command is executed.
 *
 * This is enabled by default.
 */
declare const disableLiveviewManagement: () => void;
/**
 * Whether the management of liveview streams is enabled.
 *
 * This stops the liveview stream before a command is executed and starts it again after the command is executed.
 */
declare const isLiveviewManagementEnabled: () => boolean;
/**
 * Change the pause time between queued commands.
 *
 * Time in milliseconds.
 *
 * Default is `100`
 */
declare const setPauseTime: (pauseTime: number) => void;

declare const queuePublic_enable: typeof enable;
declare const queuePublic_disable: typeof disable;
declare const queuePublic_isQueueEnabled: typeof isQueueEnabled;
declare const queuePublic_enableLiveviewManagement: typeof enableLiveviewManagement;
declare const queuePublic_disableLiveviewManagement: typeof disableLiveviewManagement;
declare const queuePublic_isLiveviewManagementEnabled: typeof isLiveviewManagementEnabled;
declare const queuePublic_setPauseTime: typeof setPauseTime;
declare namespace queuePublic {
  export {
    queuePublic_enable as enable,
    queuePublic_disable as disable,
    queuePublic_isQueueEnabled as isQueueEnabled,
    queuePublic_enableLiveviewManagement as enableLiveviewManagement,
    queuePublic_disableLiveviewManagement as disableLiveviewManagement,
    queuePublic_isLiveviewManagementEnabled as isLiveviewManagementEnabled,
    queuePublic_setPauseTime as setPauseTime,
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
 * abilities.captureChoices.includes('Image'); // true
 * abilties.captureChoices.includes('Video'); // false
 * abilties.deleteSelectedFilesOnCamera; // true
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
 * Get the serial number of a camera
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const serial = await gPhoto.getSerial();
 * serial; // 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
 * ```
 */
declare const getSerial: (identifier?: GPhotoIdentifier) => Promise<string>;
/**
 * Returns a list of connected cameras, with their respective serial numbers
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const cameras = await gPhoto.autoDetectWithSerials();
 * cameras[0].serial; // 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
 * ```
 */
declare const autoDetectWithSerials: () => Promise<GPhotoIdentifier[]>;
/**
 * Get the identifier for a camera with a given serial number
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * const serial = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
 * const identifier = await gPhoto.getIdentifierForSerial(serial);
 * identifier.port; // 'usb:XXX,XXX'
 * ```
 */
declare const getIdentifierForSerial: (serial: string) => Promise<GPhotoIdentifier>;

/**
 * Auto-focus the camera (without taking a picture)
 *
 * if `overrideManual` is true, and camera is in manual focusing mode, then it will override the manual focus setting, focus the camera, and return to the original focus mode setting
 *
 * Overriding may or may not work, depending on the camera.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.config.setValues({ '/main/capturesettings/focusmode': 'AF-C' }, true); // sets camera to auto focus (continuous) mode
 * await gPhoto.autofocus(); // camera will autofocus
 *
 * // ...
 *
 * await gPhoto.config.setValues({ '/main/capturesettings/focusmode': 'Manual' }, true); // sets camera to manual focus mode
 * await gPhoto.autofocus(); // focus won't change
 *
 * await gPhoto.autofocus(true); // camera will autofocus
 * // focus mode will still be set to manual
 *
 * ```
 */
declare const autofocus: (overrideManual: boolean, identifier?: GPhotoIdentifier) => Promise<void>;

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
 * Resetting the camera will change the port it is connected to, affecting the `port` property of the `GPhotoIdentifier` object.
 * To maintain consistency, a new `GPhotoIdentifier` object is returned, with an updated `port` property.
 * This is quite a timely operation, so it is recommended to use sparingly.
 *
 * ```ts
 * import gPhoto from 'gphoto';
 *
 * await gPhoto.reset(); // camera is disconnected and reconnected
 * ```
 */
declare const reset: (identifier?: GPhotoIdentifier) => Promise<GPhotoIdentifier>;

/**
 * A collection of functions for managing the configuration of a camera.
 */

declare const gPhoto_config: typeof config;
declare const gPhoto_capture: typeof capture;
type gPhoto_GPhotoLiveview = GPhotoLiveview;
type gPhoto_GPhotoCaptureKeep = GPhotoCaptureKeep;
type gPhoto_GPhotoCaptureOptions = GPhotoCaptureOptions;
type gPhoto_SaveLocation = SaveLocation;
type gPhoto_SaveLocationType = SaveLocationType;
type gPhoto_GPhotoIdentifier = GPhotoIdentifier;
type gPhoto_GPhotoConfigValueObj = GPhotoConfigValueObj;
type gPhoto_GPhotoConfigInfoObj = GPhotoConfigInfoObj;
type gPhoto_GPhotoConfigInfo = GPhotoConfigInfo;
type gPhoto_GPhotoConfigDataType = GPhotoConfigDataType;
type gPhoto_GPhotoConfigType = GPhotoConfigType;
type gPhoto_GPhotoAbilities = GPhotoAbilities;
declare const gPhoto_abilities: typeof abilities;
declare const gPhoto_autoDetect: typeof autoDetect;
declare const gPhoto_getSerial: typeof getSerial;
declare const gPhoto_autoDetectWithSerials: typeof autoDetectWithSerials;
declare const gPhoto_getIdentifierForSerial: typeof getIdentifierForSerial;
declare const gPhoto_autofocus: typeof autofocus;
type gPhoto_GPhotoSupportedCamera = GPhotoSupportedCamera;
declare const gPhoto_listCameras: typeof listCameras;
type gPhoto_GPhotoListedPort = GPhotoListedPort;
declare const gPhoto_listPorts: typeof listPorts;
declare const gPhoto_reset: typeof reset;
declare namespace gPhoto {
  export {
    gPhoto_config as config,
    gPhoto_capture as capture,
    queuePublic as queue,
    gPhoto_GPhotoLiveview as GPhotoLiveview,
    gPhoto_GPhotoCaptureKeep as GPhotoCaptureKeep,
    gPhoto_GPhotoCaptureOptions as GPhotoCaptureOptions,
    gPhoto_SaveLocation as SaveLocation,
    gPhoto_SaveLocationType as SaveLocationType,
    gPhoto_GPhotoIdentifier as GPhotoIdentifier,
    gPhoto_GPhotoConfigValueObj as GPhotoConfigValueObj,
    gPhoto_GPhotoConfigInfoObj as GPhotoConfigInfoObj,
    gPhoto_GPhotoConfigInfo as GPhotoConfigInfo,
    gPhoto_GPhotoConfigDataType as GPhotoConfigDataType,
    gPhoto_GPhotoConfigType as GPhotoConfigType,
    gPhoto_GPhotoAbilities as GPhotoAbilities,
    gPhoto_abilities as abilities,
    gPhoto_autoDetect as autoDetect,
    gPhoto_getSerial as getSerial,
    gPhoto_autoDetectWithSerials as autoDetectWithSerials,
    gPhoto_getIdentifierForSerial as getIdentifierForSerial,
    gPhoto_autofocus as autofocus,
    gPhoto_GPhotoSupportedCamera as GPhotoSupportedCamera,
    gPhoto_listCameras as listCameras,
    gPhoto_GPhotoListedPort as GPhotoListedPort,
    gPhoto_listPorts as listPorts,
    gPhoto_reset as reset,
  };
}

export { GPhotoAbilities, GPhotoCaptureKeep, GPhotoCaptureOptions, GPhotoConfigDataType, GPhotoConfigInfo, GPhotoConfigInfoObj, GPhotoConfigType, GPhotoConfigValueObj, GPhotoIdentifier, GPhotoListedPort, GPhotoLiveview, GPhotoSupportedCamera, SaveLocation, SaveLocationType, abilities, autoDetect, autoDetectWithSerials, autofocus, capture, config, gPhoto as default, getIdentifierForSerial, getSerial, listCameras, listPorts, queuePublic as queue, reset };
