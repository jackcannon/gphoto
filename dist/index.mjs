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
  autofocus: () => autofocus,
  capture: () => capture_exports,
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
  getAllInfo: () => getAllInfo,
  getAllValues: () => getAllValues,
  getInfo: () => getInfo,
  getValues: () => getValues,
  getValuesAsObj: () => getValuesAsObj,
  list: () => list,
  setValues: () => setValues
});

// src/utils/runCmd.ts
import { exec } from "child_process";
var ProcessPromise = class extends Promise {
  constructor(executor) {
    let process2;
    super((resolve, reject) => {
      process2 = executor(resolve, reject);
    });
    this.process = process2;
  }
};
var runCmd = (cmd, dir, printStderr = true) => new ProcessPromise(
  (resolve, reject) => exec(
    cmd,
    {
      cwd: dir || process.cwd()
    },
    (err, stdout, stderr) => {
      if (err) {
        reject(err);
        if (printStderr)
          console.error(stderr);
        return;
      }
      return resolve(stdout);
    }
  )
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
var caches = {
  configInfo: /* @__PURE__ */ new Map(),
  list: /* @__PURE__ */ new Map()
};
var parseID = (identifer = {}) => identifer.port || identifer.model || "auto";
var getInfoStore = (id) => {
  const store = caches.configInfo.get(id);
  if (store)
    return store;
  caches.configInfo.set(id, /* @__PURE__ */ new Map());
  return caches.configInfo.get(id);
};
var addToConfigInfoCache = (info, identifer) => {
  const id = parseID(identifer);
  const store = getInfoStore(id);
  store.set(info.key, info);
};
var getMultipleFromConfigInfoCache = (keys, identifer) => {
  const id = parseID(identifer);
  const store = getInfoStore(id);
  return ObjectUtils.clean(
    Object.fromEntries(
      zip(
        keys,
        keys.map((key) => store.get(key))
      )
    )
  );
};
var getConfigKeyListFromCache = (identifer) => {
  const id = parseID(identifer);
  return caches.list.get(id);
};
var setConfigKeyListInCache = (list2, identifer) => {
  const id = parseID(identifer);
  caches.list.set(id, list2);
};

// src/utils/configUtils.ts
import { ObjectUtils as ObjectUtils2 } from "swiss-ak";
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
var parseConfigInfo = (configInfo, knownKeys, identifier) => {
  const rawEntries = configInfo.split("\nEND\n").filter((str) => str.replace("\n", "").trim().length);
  const parsed = rawEntries.map((rawInfo, index) => parseSingleConfigInfo(rawInfo, knownKeys ? knownKeys[index] : void 0, identifier));
  return parsed;
};
var parseSingleConfigInfo = (configInfo, knownKey, identifier) => {
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
  addToConfigInfoCache(config, identifier);
  const current = parseCurrentValueString(currentStr, config.type);
  return [current, config];
};
var filterOutMissingKeys = async (keys, condition) => {
  if (!condition)
    return keys;
  const list2 = await list();
  return keys.filter((key) => list2.includes(key));
};
var filterOutMissingProps = async (obj, condition) => {
  if (!condition)
    return obj;
  const list2 = await list();
  return ObjectUtils2.filter(obj, (key) => list2.includes(key));
};
var getAllConfigInfoAndValues = async (identifier) => {
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-all-config`);
  return parseConfigInfo(out, void 0, identifier);
};
var getMultipleConfigInfoAndValues = async (keys, identifier) => {
  const flags = keys.map((key) => `--get-config ${wrapQuotes(key)}`);
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(" ")}`);
  return parseConfigInfo(out, keys, identifier);
};

// src/commands/config.ts
var list = async (identifier) => {
  const cached = getConfigKeyListFromCache(identifier);
  if (cached)
    return cached;
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-config`);
  const lines = out.split("\n").map((s) => s.trim()).filter((s) => s.length);
  setConfigKeyListInCache(lines, identifier);
  return lines;
};
var getAll = async (identifier) => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const valuesEntries = pairs.map(([value, info]) => [info.key, value]);
  const infoEntries = pairs.map(([value, info]) => [info.key, info]);
  return {
    info: Object.fromEntries(infoEntries),
    values: Object.fromEntries(valuesEntries)
  };
};
var getAllInfo = async (identifier) => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const infoEntries = pairs.map(([value, info]) => [info.key, info]);
  return Object.fromEntries(infoEntries);
};
var getAllValues = async (identifier) => {
  const pairs = await getAllConfigInfoAndValues(identifier);
  const valuesEntries = pairs.map(([value, info]) => [info.key, value]);
  return Object.fromEntries(valuesEntries);
};
var get = async (keys, checkIfMissing = false, identifier) => {
  const checked = await filterOutMissingKeys(keys, checkIfMissing);
  const pairs = await getMultipleConfigInfoAndValues(checked, identifier);
  const valuesEntries = pairs.map(([value, info]) => [info.key, value]);
  const infoEntries = pairs.map(([value, info]) => [info.key, info]);
  return {
    info: Object.fromEntries(infoEntries),
    values: Object.fromEntries(valuesEntries)
  };
};
var getInfo = async (keys, checkIfMissing = false, identifier) => {
  const checked = await filterOutMissingKeys(keys, checkIfMissing);
  const pairs = await getMultipleConfigInfoAndValues(checked, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, info]));
};
var getValuesAsObj = async (keys, checkIfMissing = false, identifier) => {
  const checked = await filterOutMissingKeys(keys, checkIfMissing);
  const pairs = await getMultipleConfigInfoAndValues(checked, identifier);
  return Object.fromEntries(pairs.map(([value, info]) => [info.key, value]));
};
var getValues = async (keys, checkIfMissing = false, identifier) => {
  const valuesObj = await getValuesAsObj(keys, checkIfMissing, identifier);
  return keys.map((key) => valuesObj[key]);
};
var setValues = async (values, checkIfMissing = false, identifier) => {
  const checked = await filterOutMissingProps(values, checkIfMissing);
  const keys = Object.keys(checked);
  const cached = getMultipleFromConfigInfoCache(keys, identifier);
  const allInfos = Object.values(cached);
  const missing = keys.filter((key) => !cached[key]);
  if (missing.length) {
    const newInfos = await getInfo(missing, false, identifier);
    allInfos.push(...Object.values(newInfos));
  }
  const flags = Object.entries(checked).map(([key, value]) => {
    const info = allInfos.find((info2) => info2 && info2.key === key);
    const valStr = convertValueToString(value, info.type);
    return `--set-config-value ${wrapQuotes(key)}=${wrapQuotes(valStr)}`;
  });
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(" ")}`);
};

// src/commands/capture.ts
var capture_exports = {};
__export(capture_exports, {
  image: () => image,
  liveview: () => liveview,
  preview: () => preview
});

// src/utils/captureUtils.ts
import path from "path";
var getDirAndFile = (line) => {
  const pathOrFile = line.replace(/(New file is in location|Saving file as|Deleting file|Keeping file|on the camera)/g, "").trim();
  const dir = (pathOrFile.match(/(.*[\\\/])*/) || [])[0].replace(/[\\\/]$/, "");
  const filename = (pathOrFile.match(/[^\\\/]*$/) || [])[0];
  return { dir, filename };
};
var parseCaptureStdout = (stdout, localDir) => {
  if (!localDir)
    localDir = process.cwd();
  let savedFiles = [];
  const lines = stdout.split("\n").map((line) => line.trim()).filter((line) => line.length);
  for (let line of lines) {
    const type = line.endsWith("on the camera") ? "camera" : "local";
    let { dir, filename } = getDirAndFile(line);
    if (type === "local")
      dir = localDir;
    const full = path.join(dir, filename);
    if (line.startsWith("New file is in location") || line.startsWith("Saving file as")) {
      savedFiles.push({ type, dir, filename, full });
    }
    if (line.startsWith("Deleting file")) {
      savedFiles = savedFiles.filter((s) => s.filename !== filename && s.type !== type && s.dir !== dir);
    }
  }
  return savedFiles;
};

// src/commands/capture/options.ts
import { YEAR, fn, waitFor, waitUntil } from "swiss-ak";
var getFlags = (options) => {
  const flags = [];
  if (options.filename)
    flags.push(`--filename=${wrapQuotes(options.filename)}`);
  if (options.filenumber)
    flags.push(`--filenumber=${options.filenumber}`);
  if (options.download !== false && options.keep !== void 0) {
    if (options.keep === true)
      flags.push(`--keep`);
    if (options.keep === false)
      flags.push(`--no-keep`);
    if (options.keep === "raw")
      flags.push(`--keep-raw`);
  }
  if (options.bulb)
    flags.push(`--bulb=${fn.fixFloat(options.bulb / 1e3)}`);
  if (options.frames)
    flags.push(`--frames=${options.frames}`);
  if (options.interval)
    flags.push(`--interval=${fn.fixFloat(options.interval / 1e3)}`);
  if (options.onlyNew)
    flags.push(`--new`);
  if (options.skipExisting)
    flags.push(`--skip-existing`);
  return flags.join(" ");
};
var getWait = async (options) => {
  if (options.wait) {
    if (options.wait > YEAR) {
      await waitUntil(options.wait);
    } else {
      await waitFor(options.wait);
    }
  }
};

// src/commands/capture/liveview.ts
import http from "http";
import { getDeferred, seconds, wait as wait2 } from "swiss-ak";

// src/commands/reset.ts
import { wait } from "swiss-ak";
var reset = async (identifier) => {
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --reset`);
  await wait(0);
};

// src/commands/capture/liveview.ts
var liveview = async (cb, autoStart = false, identifier) => {
  let capture;
  let response;
  let stopPromise = null;
  const start = async () => {
    if (capture) {
      await stop();
    }
    await reset(identifier);
    const uniqueId = ("0".repeat(10) + Math.random().toString(36).slice(2)).slice(-10);
    const port = 65535 - 1337 - 420 - 69;
    const url = `http://localhost:${port}/${uniqueId}.jpg`;
    const cmd = `gphoto2 --capture-movie --stdout | ffmpeg -re -i pipe:0 -listen 1 -f mjpeg ${url}`;
    try {
      capture = runCmd(cmd, void 0, false);
      const handleError = async () => {
        capture.process.on("close", () => {
          if (stopPromise) {
            stopPromise.resolve();
          }
        });
        try {
          await capture;
        } catch (err) {
        }
      };
      handleError();
      const attemptConnection = async () => {
        try {
          await wait2(seconds(1));
          await new Promise((resolve, reject) => {
            let resolved = false;
            const getter = http.get(url, (res) => {
              res.on("data", (chunk) => {
                cb(chunk);
                if (!resolved) {
                  response = res;
                  resolved = true;
                  resolve();
                }
              });
              res.on("error", reject);
            });
            getter.on("error", reject);
          });
        } catch (err) {
          await attemptConnection();
        }
      };
      await attemptConnection();
    } catch (err) {
    }
  };
  const stop = async () => {
    stopPromise = getDeferred();
    if (capture) {
      try {
        capture.process.disconnect();
        capture.process.kill();
      } catch (err) {
      }
      capture = void 0;
    }
    if (response) {
      try {
        response.destroy();
        response = null;
      } catch (err) {
      }
    }
    await stopPromise.promise;
    await reset(identifier);
  };
  if (autoStart) {
    await start();
  }
  return { start, stop };
};

// src/commands/capture.ts
var image = async (options = {}, identifier) => {
  const mainFlag = options.download !== false ? "--capture-image-and-download" : "--capture-image";
  const flags = getFlags(options);
  const cmd = `gphoto2 ${getIdentifierFlags(identifier)} ${mainFlag} ${flags} --force-overwrite`;
  await getWait(options);
  const out = await runCmd(cmd, options.directory);
  return parseCaptureStdout(out, options.directory);
};
var preview = async (options = {}, identifier) => {
  let opts = options;
  if (options.filename) {
    opts = { ...options, filename: options.filename.replace(/%C/g, "jpg") };
  }
  const flags = getFlags(opts);
  const cmd = `gphoto2 ${getIdentifierFlags(identifier)} --capture-preview ${flags} --force-overwrite`;
  await getWait(options);
  const out = await runCmd(cmd, options.directory);
  return parseCaptureStdout(out, options.directory);
};

// src/commands/abilities.ts
import { fn as fn2 } from "swiss-ak";
var toCamelCase = (input) => input.toLowerCase().replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/g).map((word, index) => index ? fn2.capitalise(word) : word).join("");
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

// src/commands/autofocus.ts
import { ObjectUtils as ObjectUtils3, zip as zip3 } from "swiss-ak";
var findBestAFMode = (info, initial) => {
  return info.choices.find((choice) => choice.toLowerCase().startsWith("af-s")) || info.choices.find((choice) => choice.toLowerCase().startsWith("af")) || info.choices.find((choice) => choice.toLowerCase().startsWith("a")) || initial;
};
var KNOWN_FOCUSMODE_KEYS = ["/main/capturesettings/focusmode", "/main/capturesettings/focusmode2"];
var autofocus = async (overrideManual, identifier) => {
  let originalFocusModes = KNOWN_FOCUSMODE_KEYS.map(() => void 0);
  if (overrideManual) {
    const { info, values } = await get(KNOWN_FOCUSMODE_KEYS, true, identifier);
    const focusModeInfos = KNOWN_FOCUSMODE_KEYS.map((key) => info[key]);
    const focusModeValues = KNOWN_FOCUSMODE_KEYS.map((key) => values[key]);
    if (focusModeValues.some((v) => v && v.toLowerCase().startsWith("m"))) {
      originalFocusModes = focusModeValues;
      const newFocusModeValues = KNOWN_FOCUSMODE_KEYS.map(
        (key, i) => {
          var _a;
          return ((_a = focusModeValues[i]) == null ? void 0 : _a.toLowerCase().startsWith("m")) ? findBestAFMode(focusModeInfos[i], focusModeValues[i]) : void 0;
        }
      );
      const newValues = Object.fromEntries(zip3(KNOWN_FOCUSMODE_KEYS, newFocusModeValues));
      await setValues(ObjectUtils3.clean(newValues), true, identifier);
    }
  }
  await setValues({ "/actions/autofocusdrive": true }, true, identifier);
  if (overrideManual && originalFocusModes.some((v) => v !== void 0)) {
    const newValues = Object.fromEntries(zip3(KNOWN_FOCUSMODE_KEYS, originalFocusModes));
    await setValues(ObjectUtils3.clean(newValues), true, identifier);
  }
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

// src/index.ts
var src_default = gPhoto_exports;
export {
  abilities,
  autoDetect,
  autofocus,
  capture_exports as capture,
  config_exports as config,
  src_default as default,
  listCameras,
  listPorts,
  reset
};
