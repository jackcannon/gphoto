export const debugging = {
  isOn: false
};

/**
 * Turn on debugging mode, so that commands are printed as they are run.
 * Useful for debugging.
 */
export const setDebugging = (debug: boolean) => {
  debugging.isOn = debug;
};

export const log = (message) => {
  if (!debugging.isOn) return;
  const date = new Date().toISOString().substring(11, 23);
  console.log(`\u001b[2m[${date}]\u001b[22m \u001b[100m\u001b[30m gPho \u001b[39m\u001b[49m \u001b[2m${message}\u001b[22m`);
};
