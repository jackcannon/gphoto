/**
 * Function for handling gphoto2 errors.
 *
 * Receives a short error message and the full stderr output.
 *
 * Must return a boolean indicating whether the error should be resolved or rejected.
 *
 * Can be async.
 */
export type GPhotoErrorHandler = (short: string, long: string) => Promise<boolean> | boolean;

export const errorHandling: { handler: GPhotoErrorHandler } = {
  handler: null
};

export const parseShortErrorMessage = (stderr: string): string => {
  const lines = stderr
    .split(/\n|\r/)
    .map((s) => s.trim())
    .filter((s) => s);

  const errIndex1 = lines.findIndex((line) => line.startsWith('*** Error ***'));
  if (errIndex1 !== -1) {
    return lines[errIndex1 + 1];
  }

  const errIndex2 = lines.findIndex((line) => line.startsWith('*** Error ('));
  if (errIndex2 !== -1) {
    const line = lines[errIndex2];
    const match = line.match(/\*\*\* Error \((.*)\) \*\*\*/);
    return match?.[1] || match?.[0] || line;
  }

  const errIndex3 = lines.findIndex((line) => line.startsWith('*** Error:'));
  if (errIndex3 !== -1) {
    const line = lines[errIndex3];
    const match = line.match(/\*\*\* Error: (.*) \*\*\*/);
    return match?.[1] || match?.[0] || line;
  }

  const errIndexConnReset = lines.findIndex((line) => line.toLowerCase().includes('connection reset by peer'));
  if (errIndexConnReset !== -1) {
    return 'Connection reset by peer';
  }

  const errIndexGeneric = lines.findIndex((line) => line.toLowerCase().startsWith('error'));
  if (errIndexGeneric !== -1) {
    const line = lines[errIndexGeneric];
    return line;
  }

  return '';
};

/**
 * Set a function for handling gphoto2 errors.
 *
 * On error, the provided function receives a short error message and the full stderr output.
 *
 * It must return a boolean indicating whether the error should be resolved or rejected.
 *
 * It can be async.
 */
export const setErrorHandler = (fn: GPhotoErrorHandler): void => {
  errorHandling.handler = fn;
};
