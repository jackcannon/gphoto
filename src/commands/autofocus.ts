import { ObjectUtils, tryOr, zip } from 'swiss-ak';
import { GPhotoConfigInfo, GPhotoConfigValueObj } from '../gPhoto';
import { GPhotoIdentifier } from '../utils/identifiers';
import * as config from './config';
import { pauseLiveviewWrapper } from '../utils/queue';

const findBestAFMode = (info: GPhotoConfigInfo, initial: string): string => {
  return (
    info.choices.find((choice) => choice.toLowerCase().startsWith('af-s')) ||
    info.choices.find((choice) => choice.toLowerCase().startsWith('af')) ||
    info.choices.find((choice) => choice.toLowerCase().startsWith('a')) ||
    initial
  );
};

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
export const autofocus = async (overrideManual: boolean, identifier?: GPhotoIdentifier): Promise<void> =>
  pauseLiveviewWrapper(identifier, async () => {
    const keys = await config.findAppropriateConfigKeys(['focusmode', 'focusmode2'], identifier);
    const [autofocusdriveKey] = await config.findAppropriateConfigKeys(['autofocusdrive'], identifier);

    let original: string[] = keys.map(() => undefined);

    if (overrideManual) {
      const { info, values } = await config.get(keys, true, identifier);

      const modeInfos = keys.map((key) => info[key]);
      const modeValues = keys.map((key) => values[key] as string);

      if (modeValues.some((v) => v && v.toLowerCase().startsWith('m'))) {
        original = modeValues;

        const newModeValues = keys.map((key, i) =>
          modeValues[i]?.toLowerCase().startsWith('m') ? findBestAFMode(modeInfos[i], modeValues[i]) : undefined
        );

        const newValues: GPhotoConfigValueObj = Object.fromEntries(zip(keys, newModeValues));
        await config.setValues(ObjectUtils.clean(newValues), true, identifier);
      }
    }

    try {
      config.setValues({ [autofocusdriveKey]: true }, true, identifier);
    } catch (e) {
      // This will sometimes 'error' with a message like "Not in focus".
      // Yeah, no shit mate, that's why I'm trying to focus it.
      // So we just catch errors for this and ignore it.
    }

    if (overrideManual && original.some((v) => v !== undefined)) {
      const newValues: GPhotoConfigValueObj = Object.fromEntries(zip(keys, original));
      await config.setValues(ObjectUtils.clean(newValues), true, identifier);
    }
  });
