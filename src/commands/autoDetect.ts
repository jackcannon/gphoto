import { runCmd } from '../utils/runCmd';
import { readTable } from '../utils/readTable';

export interface GPhotoAutoDetectCamera {
  model: string;
  port: string;
}

// TODO docs
export const autoDetect = async (): Promise<GPhotoAutoDetectCamera[]> => {
  const out = await runCmd('gphoto2 --auto-detect');

  const cameras = readTable<GPhotoAutoDetectCamera>(out, ['model', 'port']);

  return cameras;
};
