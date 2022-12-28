import { addToCache } from './configCache';
import { GPhotoIdentifier, getIdentifierFlags } from './identifiers';
import { runCmd } from './runCmd';
import { wrapQuotes } from './wrapQuotes';

/**
 * Possible data types for a config value.
 */
export type GPhotoConfigDataType = string | number | boolean | Date;

/**
 * Possible types of a config.
 *
 * | Value    | Date Type         | Description                   |
 * | -------- | ----------------- | ----------------------------- |
 * | 'DATE'   | `Date` or `'now'` | A date value                  |
 * | 'MENU'   | `string`          | Has a list of choices         |
 * | 'RADIO'  | `string`          | Has a list of choices         |
 * | 'RANGE'  | `number`          | A number value within a range |
 * | 'TEXT'   | `string`          | A text value                  |
 * | 'TOGGLE' | `boolean`         | An on/off value               |
 */
export type GPhotoConfigType = 'DATE' | 'MENU' | 'RADIO' | 'RANGE' | 'TEXT' | 'TOGGLE';

/**
 * The information about a configuration option.
 * Contains details on how to display and edit the value.
 */
export interface GPhotoConfigInfo {
  key: string;
  label: string;
  readonly: boolean;
  type: GPhotoConfigType;
  choices?: string[];

  /**
   * Only for RANGE
   */
  min?: number;
  /**
   * Only for RANGE
   */
  max?: number;
  /**
   * Only for RANGE
   */
  step?: number;

  /**
   * Some configs provide help text
   */
  help?: string;
}

/**
 * A map of config keys to their configuration option info.
 */
export interface GPhotoConfigInfoObj {
  [key: string]: GPhotoConfigInfo;
}

/**
 * A map of config keys to their current value.
 */
export interface GPhotoConfigValueObj {
  [key: string]: GPhotoConfigDataType;
}

export const parseCurrentValueString = (value: string, type: GPhotoConfigType): GPhotoConfigDataType => {
  if (type === 'TOGGLE') return Number(value) === 2 ? null : Boolean(Number(value)); // 2 means not set
  if (type === 'RANGE') return Number(value); // number
  if (type === 'DATE') return value === 'now' ? new Date() : new Date(Number(value) * 1000);
  return value;
};

export const convertValueToString = (value: GPhotoConfigDataType, type: GPhotoConfigType): string => {
  if (type === 'TOGGLE') return value == null ? '2' : !!value ? '1' : '0'; // 2 means not set
  if (type === 'RANGE') return value + ''; // number
  if (type === 'DATE') return value === 'now' ? 'now' : Math.ceil(Number(value) / 1000) + '';
  return value + '';
};

/**
 * Parses the output of `gphoto2 --list-all-config`
 * First line may be key. If not (i.e. --get-config=XXX), it is passed in as knownKey
 */
export const parseConfigInfo = (configInfo: string, knownKeys?: string[]): [GPhotoConfigDataType, GPhotoConfigInfo][] => {
  const rawEntries = configInfo.split('\nEND\n').filter((str) => str.replace('\n', '').trim().length);
  const parsed = rawEntries.map((rawInfo, index) => parseSingleConfigInfo(rawInfo, knownKeys ? knownKeys[index] : undefined));

  return parsed;
};

export const parseSingleConfigInfo = (configInfo: string, knownKey?: string): [GPhotoConfigDataType, GPhotoConfigInfo] => {
  const lines = configInfo.split('\n').filter((str) => str.trim().length && str.trim() !== 'END');

  const key = knownKey ? knownKey : lines[0];
  const rest = knownKey ? lines : lines.slice(1);

  const config: GPhotoConfigInfo = {
    key,
    label: '',
    readonly: true,
    type: 'TEXT'
  };
  let currentStr: string = '';

  for (let line of rest) {
    const [prop, value] = line.split(': ').map((s) => s.trim());

    if (value === undefined) continue;

    const propName = prop.toLowerCase();
    if (propName === 'label') config.label = value;
    if (propName === 'readonly') config.readonly = Boolean(Number(value));
    if (propName === 'type') config.type = value as GPhotoConfigType;
    if (propName === 'current') currentStr = value;
    if (propName === 'choice') {
      if (!config.choices) config.choices = [];
      config.choices.push(value.replace(/^[0-9]+\s?/, ''));
    }

    if (propName === 'bottom') config.min = Number(value);
    if (propName === 'top') config.max = Number(value);
    if (propName === 'step') config.step = Number(value);

    if (propName === 'help') config.help = value;
    if (propName === 'printable') {
      // do nothing
    }
  }

  addToCache(config); // cheekily cache config info

  const current: GPhotoConfigDataType = parseCurrentValueString(currentStr, config.type);

  return [current, config];
};

// not public API
export const getAllConfigInfoAndValues = async (identifier?: GPhotoIdentifier): Promise<[GPhotoConfigDataType, GPhotoConfigInfo][]> => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-all-config`);

  return parseConfigInfo(out);
};

// not public API
export const getMultipleConfigInfoAndValues = async (
  keys: string[],
  identifier?: GPhotoIdentifier
): Promise<[GPhotoConfigDataType, GPhotoConfigInfo][]> => {
  const flags = keys.map((key) => `--get-config ${wrapQuotes(key)}`);
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(' ')}`);
  return parseConfigInfo(out, keys);
};
