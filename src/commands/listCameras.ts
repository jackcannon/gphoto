import { runCmd } from '../utils/runCmd';

// TODO docs
export interface GPhotoSupportedCamera {
  model: string;
  flag?: string;
}

// TODO docs
export const listCameras = async (): Promise<GPhotoSupportedCamera[]> => {
  const out = await runCmd('gphoto2 --list-cameras');

  const lines = out.split('\n');
  const startIndex = lines.findIndex((line) => line.trim().startsWith('Supported cameras:')) + 1;

  const rows = lines
    .slice(startIndex)
    .map((line) => line.trim().match(/"(.*)"(?: \((.*)\))?/))
    .filter((match) => match)
    .map(([_match, model, flag]) => {
      const result: GPhotoSupportedCamera = { model };
      if (flag) {
        result.flag = flag;
      }
      return result;
    });

  return rows;
};
