var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/gPhoto.ts
var gPhoto_exports = {};
__export(gPhoto_exports, {
  abilities: () => abilities,
  autoDetect: () => autoDetect,
  config: () => config_exports,
  listCameras: () => listCameras,
  listPorts: () => listPorts,
  reset: () => reset
});

// src/commands/config.ts
var config_exports = {};
__export(config_exports, {
  get: () => get,
  getAll: () => getAll,
  getAllInfos: () => getAllInfos,
  getAllValues: () => getAllValues,
  getInfos: () => getInfos,
  getSingle: () => getSingle,
  getSingleInfo: () => getSingleInfo,
  list: () => list,
  set: () => set,
  setSingle: () => setSingle
});

// src/utils/runCmd.ts
import { exec } from "child_process";
var ProcessPromise = class extends Promise {
  constructor(executor) {
    let process;
    super((resolve, reject) => {
      process = executor(resolve, reject);
    });
    this.process = process;
  }
};
var runCmd = (cmd) => new ProcessPromise(
  (resolve, reject) => exec(cmd, {}, (err, stdout, stderr) => {
    if (err) {
      reject(err);
      console.error(stderr);
      return;
    }
    return resolve(stdout);
  })
);

// src/utils/wrapQuotes.ts
var wrapQuotes = (pathStr) => {
  const escaped = pathStr.replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f").replace(/\\/g, "\\\\").replace(/\v/g, "\\v").replace(/\0/g, "\\0");
  return `"${escaped}"`;
};

// src/utils/identifiers.ts
var getIdentifierFlags = (identifier) => {
  if (!identifier)
    return "";
  let result = "";
  if (identifier.port) {
    result += ` --port ${wrapQuotes(identifier.port)}`;
  }
  if (identifier.model) {
    result += ` --camera ${wrapQuotes(identifier.model)}`;
  }
  return result.trim();
};

// src/utils/configCache.ts
import { ObjectUtils, zip } from "swiss-ak";
var configCache = /* @__PURE__ */ new Map();
var addToCache = (info) => {
  configCache.set(info.key, info);
};
var getFromCache = (key) => {
  return configCache.get(key);
};
var getMultipleFromCache = (keys) => {
  return ObjectUtils.clean(Object.fromEntries(zip(keys, keys.map(getFromCache))));
};

// src/utils/configUtils.ts
var parseCurrentValueString = (value, type) => {
  if (type === "TOGGLE")
    return Number(value) === 2 ? null : Boolean(Number(value));
  if (type === "RANGE")
    return Number(value);
  if (type === "DATE")
    return value === "now" ? new Date() : new Date(Number(value) * 1e3);
  return value;
};
var convertValueToString = (value, type) => {
  if (type === "TOGGLE")
    return value == null ? "2" : !!value ? "1" : "0";
  if (type === "RANGE")
    return value + "";
  if (type === "DATE")
    return value === "now" ? "now" : Math.ceil(Number(value) / 1e3) + "";
  return value + "";
};
var parseConfigInfo = (configInfo, knownKeys) => {
  const rawEntries = configInfo.split("\nEND\n").filter((str) => str.replace("\n", "").trim().length);
  const parsed = rawEntries.map((rawInfo, index) => parseSingleConfigInfo(rawInfo, knownKeys ? knownKeys[index] : void 0));
  return parsed;
};
var parseSingleConfigInfo = (configInfo, knownKey) => {
  const lines = configInfo.split("\n").filter((str) => str.trim().length && str.trim() !== "END");
  const key = knownKey ? knownKey : lines[0];
  const rest = knownKey ? lines : lines.slice(1);
  const config = {
    key,
    label: "",
    readonly: true,
    type: "TEXT"
  };
  let currentStr = "";
  for (let line of rest) {
    const [prop, value] = line.split(": ").map((s) => s.trim());
    if (value === void 0)
      continue;
    const propName = prop.toLowerCase();
    if (propName === "label")
      config.label = value;
    if (propName === "readonly")
      config.readonly = Boolean(Number(value));
    if (propName === "type")
      config.type = value;
    if (propName === "current")
      currentStr = value;
    if (propName === "choice") {
      if (!config.choices)
        config.choices = [];
      config.choices.push(value.replace(/^[0-9]+\s?/, ""));
    }
    if (propName === "bottom")
      config.min = Number(value);
    if (propName === "top")
      config.max = Number(value);
    if (propName === "step")
      config.step = Number(value);
    if (propName === "help")
      config.help = value;
    if (propName === "printable") {
    }
  }
  addToCache(config);
  const current = parseCurrentValueString(currentStr, config.type);
  return [current, config];
};
var getAllConfigInfoAndValues = async (identifier) => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-all-config`);
  return parseConfigInfo(out);
};
var getMultipleConfigInfoAndValues = async (keys, identifier) => {
  const flags = keys.map((key) => `--get-config ${wrapQuotes(key)}`);
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(" ")}`);
  return parseConfigInfo(out, keys);
};

// src/commands/config.ts
var getAll = async (identifier) => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const valuesEntries = pairs.map(([value, info]) => [info.key, value]);
  const infoEntries = pairs.map(([value, info]) => [info.key, info]);
  return {
    info: Object.fromEntries(infoEntries),
    values: Object.fromEntries(valuesEntries)
  };
};
var getAllInfos = async (identifier) => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const infoEntries = pairs.map(([value, info]) => [info.key, info]);
  return Object.fromEntries(infoEntries);
};
var getAllValues = async (identifier) => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const valuesEntries = pairs.map(([value, info]) => [info.key, value]);
  return Object.fromEntries(valuesEntries);
};
var getInfos = async (keys, identifier) => {
  const pairs = await getMultipleConfigInfoAndValues(keys, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, info]));
};
var getSingleInfo = async (key, identifier) => {
  const list2 = await getInfos([key], identifier);
  return list2[key];
};
var get = async (keys, identifier) => {
  const pairs = await getMultipleConfigInfoAndValues(keys, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, value]));
};
var getSingle = async (key, identifier) => {
  const list2 = await get([key], identifier);
  return list2[key];
};
var list = async (identifier) => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-config`);
  const lines = out.split("\n").map((s) => s.trim()).filter((s) => s.length);
  return lines;
};
var set = async (values, identifier) => {
  const keys = Object.keys(values);
  const cached = getMultipleFromCache(keys);
  const allInfos = Object.values(cached);
  const missing = keys.filter((key) => !cached[key]);
  if (missing.length) {
    const newInfos = await getInfos(missing, identifier);
    allInfos.push(...Object.values(newInfos));
  }
  const flags = Object.entries(values).map(([key, value]) => {
    const info = allInfos.find((info2) => info2 && info2.key === key);
    const valStr = convertValueToString(value, info.type);
    return `--set-config-value ${wrapQuotes(key)}=${wrapQuotes(valStr)}`;
  });
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(" ")}`);
};
var setSingle = async (key, value, identifier) => {
  await set({ [key]: value }, identifier);
};

// src/commands/abilities.ts
import { fn } from "swiss-ak";
var toCamelCase = (input) => input.toLowerCase().replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/g).map((word, index) => index ? fn.capitalise(word) : word).join("");
var keyDictionary = {
  abilitiesForCamera: "model"
};
var parseKey = (key) => {
  if (!key)
    return key;
  if (keyDictionary[key])
    return keyDictionary[key];
  const camel = toCamelCase(key);
  if (keyDictionary[camel])
    return keyDictionary[camel];
  return camel;
};
var parseValue = (value) => {
  if (value === "")
    return void 0;
  if (value === "yes")
    return true;
  if (value === "no")
    return false;
  if (!Number.isNaN(Number(value)))
    return Number(value);
  return value;
};
var parseAbilitiesTable = (out) => {
  const pairs = out.split("\n").filter((line) => line.trim().length).map((line) => line.split(":").map((item) => item.trim())).filter((pair) => pair.length === 2);
  let lastKey = "";
  const result = {};
  for (let [rawKey, rawValue] of pairs) {
    const key = parseKey(rawKey);
    const value = parseValue(rawValue);
    if (key)
      lastKey = key;
    if (key !== lastKey) {
      if (!(result[lastKey] instanceof Array)) {
        result[lastKey] = [result[lastKey]];
      }
      result[lastKey] = [...result[lastKey], value].filter((v) => v);
    } else {
      result[key] = value;
    }
  }
  return result;
};
var abilities = async (identifier) => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --abilities `);
  return parseAbilitiesTable(out);
};

// src/utils/readTable.ts
import { zip as zip2 } from "swiss-ak";
var readTable = (out, propertyNames) => {
  const lines = out.split("\n");
  const sepIndex = lines.findIndex((line) => line.trim().startsWith("-----"));
  const head = lines[sepIndex - 1];
  const rows = lines.slice(sepIndex + 1);
  const readLine = (line) => line.trim().split(/\s{3,}/);
  const properties = propertyNames || readLine(head).map((name) => name.toLowerCase().replace(/[^A-Za-z0-9]/g, "-"));
  const objs = rows.filter((line) => line.trim().length).map((line) => {
    const values = readLine(line);
    return Object.fromEntries(zip2(properties, values));
  });
  return objs;
};

// src/commands/autoDetect.ts
var autoDetect = async () => {
  const out = await runCmd("gphoto2 --auto-detect");
  const cameras = readTable(out, ["model", "port"]);
  return cameras;
};

// src/commands/listCameras.ts
var listCameras = async () => {
  const out = await runCmd("gphoto2 --list-cameras");
  const lines = out.split("\n");
  const startIndex = lines.findIndex((line) => line.trim().startsWith("Supported cameras:")) + 1;
  const rows = lines.slice(startIndex).map((line) => line.trim().match(/"(.*)"(?: \((.*)\))?/)).filter((match) => match).map(([_match, model, flag]) => {
    const result = { model };
    if (flag) {
      result.flag = flag;
    }
    return result;
  });
  return rows;
};

// src/commands/listPorts.ts
var listPorts = async () => {
  const out = await runCmd("gphoto2 --list-ports");
  const cameras = readTable(out, ["path", "description"]);
  return cameras;
};

// src/commands/reset.ts
import { wait } from "swiss-ak";
var reset = async (identifier) => {
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --reset`);
  await wait(0);
};

// src/index.ts
var src_default = gPhoto_exports;
export {
  abilities,
  autoDetect,
  config_exports as config,
  src_default as default,
  listCameras,
  listPorts,
  reset
};
