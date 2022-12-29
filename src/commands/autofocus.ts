import { ObjectUtils, zip } from 'swiss-ak';
import { GPhotoConfigInfo, GPhotoConfigValueObj } from '../gPhoto';
import { GPhotoIdentifier } from '../utils/identifiers';
import * as config from './config';

const findBestAFMode = (info: GPhotoConfigInfo, initial: string): string => {
  return (
    info.choices.find((choice) => choice.toLowerCase().startsWith('af-s')) ||
    info.choices.find((choice) => choice.toLowerCase().startsWith('af')) ||
    info.choices.find((choice) => choice.toLowerCase().startsWith('a')) ||
    initial
  );
};

// All known focus mode keys - assumes the values are strings (Manual, AF-S, AF-C, etc)
const KNOWN_FOCUSMODE_KEYS = ['/main/capturesettings/focusmode', '/main/capturesettings/focusmode2'];

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
export const autofocus = async (overrideManual: boolean, identifier?: GPhotoIdentifier): Promise<void> => {
  let originalFocusModes: string[] = KNOWN_FOCUSMODE_KEYS.map(() => undefined);

  if (overrideManual) {
    const { info, values } = await config.get(KNOWN_FOCUSMODE_KEYS, true, identifier);

    const focusModeInfos = KNOWN_FOCUSMODE_KEYS.map((key) => info[key]);
    const focusModeValues = KNOWN_FOCUSMODE_KEYS.map((key) => values[key] as string);

    if (focusModeValues.some((v) => v && v.toLowerCase().startsWith('m'))) {
      originalFocusModes = focusModeValues;

      const newFocusModeValues = KNOWN_FOCUSMODE_KEYS.map((key, i) =>
        focusModeValues[i]?.toLowerCase().startsWith('m') ? findBestAFMode(focusModeInfos[i], focusModeValues[i]) : undefined
      );

      const newValues: GPhotoConfigValueObj = Object.fromEntries(zip(KNOWN_FOCUSMODE_KEYS, newFocusModeValues));
      await config.setValues(ObjectUtils.clean(newValues), true, identifier);
    }
  }

  await config.setValues({ '/actions/autofocusdrive': true }, true, identifier);

  if (overrideManual && originalFocusModes.some((v) => v !== undefined)) {
    const newValues: GPhotoConfigValueObj = Object.fromEntries(zip(KNOWN_FOCUSMODE_KEYS, originalFocusModes));
    await config.setValues(ObjectUtils.clean(newValues), true, identifier);
  }
};
