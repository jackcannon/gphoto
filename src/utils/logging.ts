import { getAutoDetectFromCache } from './cache';
import { GPhotoIdentifier } from './identifiers';

/**
 * An indication of what level of logging to use.
 *
 * Supported levels:
 * - none: No logging
 * - error: Only errors
 * - warning: Errors and warnings (default)
 * - info: Errors, warnings and info
 * - log: Errors, warnings, info and log
 * - debug: Errors, warnings, info, log and debug
 */
export type GPhotoLogLevel = 'none' | 'error' | 'warning' | 'info' | 'log' | 'debug';

const logLevelOrder = ['none', 'error', 'warning', 'info', 'log', 'debug'];

export const logData: { level: GPhotoLogLevel; customFn: (type: GPhotoLogLevel, ...logArgs: any[]) => void } = {
  level: 'warning',
  customFn: null
};

/**
 * Set the level of logging to use.
 *
 * Supported levels:
 * - none: No logging
 * - error: Only errors
 * - warning: Errors and warnings (default)
 * - info: Errors, warnings and info
 * - log: Errors, warnings, info and log
 * - debug: Errors, warnings, info, log and debug
 */
export const setLogLevel = (logLevel: GPhotoLogLevel) => {
  logData.level = logLevel;
};

/**
 * Set a custom function to handle logging.
 *
 * If set, this function will be called instead of the default logging.
 * This will still abide by the log level set.
 */
export const setCustomLogHandler = (customFn: (type: GPhotoLogLevel, ...logArgs: any[]) => void) => {
  logData.customFn = customFn;
};

export const log = (type: GPhotoLogLevel, ...logArgs: any[]) => {
  if (logLevelOrder.indexOf(type) > logLevelOrder.indexOf(logData.level)) return;

  if (logData.customFn) {
    logData.customFn(type, ...logArgs);
    return;
  }

  if (type === 'error') console.error(...logArgs);
  if (type === 'warning') console.warn(...logArgs);
  if (type === 'info') console.info(...logArgs);
  if (type === 'log') console.log(...logArgs);
  if (type === 'debug') console.debug(...logArgs);
};

export const checkForWarnings = (fnName: string, identifier?: GPhotoIdentifier) => {
  const autoDetect = getAutoDetectFromCache();
  if (autoDetect.length > 1 && !identifier) {
    log('warning', `No identifier was provided to '${fnName}' but there are multiple cameras connected. This may cause unexpected results.`);
  }
};
