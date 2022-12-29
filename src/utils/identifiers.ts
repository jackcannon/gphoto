import { wrapQuotes } from './wrapQuotes';

/**
 * Used to identify/specify a camera. Useful if there are multiple cameras connected.
 *
 * From the gphoto2 docs:
 * > if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.
 */
export interface GPhotoIdentifier {
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

export const getIdentifierFlags = (identifier?: GPhotoIdentifier): string => {
  if (!identifier) return '';
  let result = '';

  if (identifier.port) {
    result += ` --port ${wrapQuotes(identifier.port)}`;
  }
  if (identifier.model) {
    result += ` --camera ${wrapQuotes(identifier.model)}`;
  }

  return result.trim();
};
