import { runCmd } from '../utils/runCmd';
import { readTable } from '../utils/readTable';

interface GPhotoListedPort {
  path: string;
  description: string;
}

// TODO docs
export const listPorts = async (): Promise<GPhotoListedPort[]> => {
  const out = await runCmd('gphoto2 --list-ports');

  const cameras = readTable<GPhotoListedPort>(out, ['path', 'description']);

  return cameras;
};
