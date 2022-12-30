import { GPhotoIdentifier, getID } from './identifiers';

/**
 * A liveview stream with methods for starting and stopping the stream.
 */
export interface GPhotoLiveview {
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

export const liveviewStore = new (class LiveviewStore {
  store: Map<string, GPhotoLiveview> = new Map<string, GPhotoLiveview>();

  get(identifier: GPhotoIdentifier): GPhotoLiveview {
    return this.store.get(getID(identifier));
  }

  async add(identifier: GPhotoIdentifier, liveview: GPhotoLiveview) {
    const existing = this.get(identifier);

    if (existing && existing.isRunning()) {
      await existing.stop();
    }

    this.store.set(getID(identifier), liveview);
  }
})();
