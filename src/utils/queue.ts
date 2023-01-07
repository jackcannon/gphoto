import { QueueManager, seconds } from 'swiss-ak';
import { GPhotoIdentifier, getID } from './identifiers';
import { liveviewStore } from './liveviewStore';

let isEnabled = true;
let isLiveviewMgmtEnabled = true;

const queueManager = new QueueManager(seconds(0.1));

export const pauseLiveviewWrapper = async <T>(name: string, identifier: GPhotoIdentifier, fn: () => Promise<T>): Promise<T> => {
  if (!isLiveviewMgmtEnabled) return fn();
  const liveview = liveviewStore.get(identifier);
  const isRunning = !!(liveview && liveview.isRunning());

  if (isRunning) {
    await liveview.stop();
  }

  const result = await fn();

  if (isRunning) {
    await liveview.start();
  }

  return result;
};

export const addToQueue = async <T>(name: string, identifier: GPhotoIdentifier, fn: () => Promise<T>): Promise<T> => {
  if (!isLiveviewMgmtEnabled) return addToQueueSimple(name, identifier, fn);
  if (!isEnabled) return fn();
  return await queueManager.add(getID(identifier), () => pauseLiveviewWrapper(name, identifier, fn));
};

// Queue without managing liveview - used by liveview.ts, and by addToQueue if liveview management is disabled
export const addToQueueSimple = async <T>(name: string, identifier: GPhotoIdentifier, fn: () => Promise<T>): Promise<T> => {
  if (!isEnabled) return fn();

  return queueManager.add(getID(identifier), fn);
};

/**
 * Enable the queuing functionality. This is enabled by default.
 */
export const enable = () => {
  isEnabled = true;
};

/**
 * Disable the queuing functionality. It is enabled by default.
 */
export const disable = () => {
  isEnabled = false;
};

/**
 * Whether the queuing functionality is enabled.
 */
export const isQueueEnabled = () => isEnabled;

/**
 * Enable the management of liveview streams.
 *
 * This stops the liveview stream before a command is executed and starts it again after the command is executed.
 *
 * This is enabled by default.
 */
export const enableLiveviewManagement = () => {
  isLiveviewMgmtEnabled = true;
};

/**
 * Disable the management of liveview streams.
 *
 * This stops the liveview stream before a command is executed and starts it again after the command is executed.
 *
 * This is enabled by default.
 */
export const disableLiveviewManagement = () => {
  isLiveviewMgmtEnabled = false;
};

/**
 * Whether the management of liveview streams is enabled.
 *
 * This stops the liveview stream before a command is executed and starts it again after the command is executed.
 */
export const isLiveviewManagementEnabled = () => isLiveviewMgmtEnabled;

/**
 * Change the pause time between queued commands.
 *
 * Time in milliseconds.
 *
 * Default is `100`
 */
export const setPauseTime = (pauseTime: number) => {
  queueManager.setDefaultPauseTime(pauseTime);
};
