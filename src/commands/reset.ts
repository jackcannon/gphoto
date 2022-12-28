import { wait } from 'swiss-ak';
import { runCmd } from '../utils/runCmd';
import { GPhotoIdentifier, getIdentifierFlags } from '../utils/identifiers';

// TODO docs
export const reset = async (identifier?: GPhotoIdentifier): Promise<void> => {
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --reset`);
  await wait(0);
};
