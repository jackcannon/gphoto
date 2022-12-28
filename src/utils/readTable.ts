/**
 * Reads tables output by gphoto2
 */

import { zip } from 'swiss-ak';

export const readTable = <T extends unknown>(out: string, propertyNames?: string[]): T[] => {
  const lines = out.split('\n');

  const sepIndex = lines.findIndex((line) => line.trim().startsWith('-----'));

  const head = lines[sepIndex - 1];
  const rows = lines.slice(sepIndex + 1);

  const readLine = (line) => line.trim().split(/\s{3,}/);

  const properties = propertyNames || readLine(head).map((name) => name.toLowerCase().replace(/[^A-Za-z0-9]/g, '-'));

  const objs = rows
    .filter((line) => line.trim().length)
    .map((line) => {
      const values = readLine(line);

      return Object.fromEntries(zip(properties, values)) as T;
    });

  return objs;
};
