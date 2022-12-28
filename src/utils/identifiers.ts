import { wrapQuotes } from './wrapQuotes';

/**
 * Used to specify a camera to use.
 *
 * Note that if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.
 */
export interface GPhotoIdentifier {
  port?: string;

  /**
   * Note that if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.
   */
  model?: string;
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
