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
  autoDetectWithSerials: () => autoDetectWithSerials,
  autofocus: () => autofocus,
  capture: () => capture_exports,
  config: () => config_exports,
  getIdentifierForSerial: () => getIdentifierForSerial,
  getSerial: () => getSerial,
  listCameras: () => listCameras,
  listPorts: () => listPorts,
  queue: () => queue_public_exports,
  reset: () => reset,
  setErrorHandler: () => setErrorHandler
});

// src/commands/config.ts
var config_exports = {};
__export(config_exports, {
  findAppropriateConfigKeys: () => findAppropriateConfigKeys,
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

// src/utils/queue.ts
import { QueueManager, seconds } from "swiss-ak";

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
var getID = (identifier) => identifier ? `gphoto__${identifier.model}_${identifier.port}` : `gphoto_DEFAULT`;

// src/utils/liveviewStore.ts
var liveviewStore = new class LiveviewStore {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  get(identifier) {
    return this.store.get(getID(identifier));
  }
  async add(identifier, liveview2) {
    const existing = this.get(identifier);
    if (existing && existing.isRunning()) {
      await existing.stop();
    }
    this.store.set(getID(identifier), liveview2);
  }
}();

// src/utils/queue.ts
var isEnabled = true;
var isLiveviewMgmtEnabled = true;
var queueManager = new QueueManager(seconds(0.1));
var pauseLiveviewWrapper = async (identifier, fn3) => {
  if (!isLiveviewMgmtEnabled)
    return fn3();
  const liveview2 = liveviewStore.get(identifier);
  const isRunning = liveview2 && liveview2.isRunning();
  if (isRunning) {
    await liveview2.stop();
  }
  const result = await fn3();
  if (isRunning) {
    await liveview2.start();
  }
  return result;
};
var addToQueue = async (identifier, fn3) => {
  if (!isLiveviewMgmtEnabled)
    return addToQueueSimple(identifier, fn3);
  if (!isEnabled)
    return fn3();
  return await queueManager.add(getID(identifier), () => pauseLiveviewWrapper(identifier, fn3));
};
var addToQueueSimple = async (identifier, fn3) => {
  if (!isEnabled)
    return fn3();
  return queueManager.add(getID(identifier), fn3);
};
var enable = () => {
  isEnabled = true;
};
var disable = () => {
  isEnabled = false;
};
var isQueueEnabled = () => isEnabled;
var enableLiveviewManagement = () => {
  isLiveviewMgmtEnabled = true;
};
var disableLiveviewManagement = () => {
  isLiveviewMgmtEnabled = false;
};
var isLiveviewManagementEnabled = () => isLiveviewMgmtEnabled;
var setPauseTime = (pauseTime) => {
  queueManager.setDefaultPauseTime(pauseTime);
};

// src/utils/errorHandling.ts
var errorHandling = {
  handler: null
};
var parseShortErrorMessage = (stderr) => {
  const lines = stderr.split("\n").map((s) => s.trim()).filter((s) => s);
  const errIndex1 = lines.findIndex((line) => line.startsWith("*** Error ***"));
  if (errIndex1 !== -1) {
    return lines[errIndex1 + 1];
  }
  const errIndex2 = lines.findIndex((line) => line.startsWith("*** Error ("));
  if (errIndex2 !== -1) {
    const line = lines[errIndex2];
    const match = line.match(/\*\*\* Error \(-5: \'(Unknown port)\'\) \*\*\*/);
    return (match == null ? void 0 : match[1]) || (match == null ? void 0 : match[0]) || line;
  }
  return "";
};
var setErrorHandler = (fn3) => {
  errorHandling.handler = fn3;
};

// src/utils/runCmd.ts
var ProcessPromise = class extends Promise {
  constructor(executor) {
    let process2;
    super((resolve, reject) => {
      process2 = executor(resolve, reject);
    });
    this.process = process2;
  }
};
var runCmdUnqueued = (cmd, dir, skipErrorReporting = false) => new ProcessPromise(
  (resolve, reject) => exec(
    cmd,
    {
      cwd: dir || process.cwd()
    },
    async (err, stdout, stderr) => {
      if (err) {
        const shortMsg = parseShortErrorMessage(stderr);
        if (!skipErrorReporting && errorHandling.handler) {
          const doResolve = await errorHandling.handler(shortMsg, stderr);
          if (doResolve) {
            return resolve("");
          } else {
            reject(shortMsg);
          }
        } else {
          reject(shortMsg);
        }
        return;
      }
      return resolve(stdout);
    }
  )
);
var runCmd = (cmd, identifier, dir, skipErrorReporting) => addToQueue(identifier, () => runCmdUnqueued(cmd, dir, skipErrorReporting));

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
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-all-config`, identifier);
  return parseConfigInfo(out, void 0, identifier);
};
var getMultipleConfigInfoAndValues = async (keys, identifier) => {
  const flags = keys.map((key) => `--get-config ${wrapQuotes(key)}`);
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(" ")}`, identifier);
  return parseConfigInfo(out, keys, identifier);
};

// src/commands/config.ts
var list = async (identifier) => {
  const cached = getConfigKeyListFromCache(identifier);
  if (cached)
    return cached;
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --list-config`, identifier);
  const lines = out.split("\n").map((s) => s.trim()).filter((s) => s.length);
  setConfigKeyListInCache(lines, identifier);
  return lines;
};
var findAppropriateConfigKeys = async (keys, identifier) => {
  const allKeys = await list(identifier);
  return keys.map((key) => {
    if (allKeys.includes(key))
      return key;
    const endsWith = allKeys.find((k) => k.endsWith(key));
    if (endsWith)
      return endsWith;
    const hasAfterSlash = allKeys.find((k) => k.includes("/" + key));
    if (hasAfterSlash)
      return hasAfterSlash;
    return key;
  });
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
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} ${flags.join(" ")}`, identifier);
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
import { getDeferred, seconds as seconds2, wait } from "swiss-ak";
var isPortOpen = async (port) => {
  return new Promise((resolve) => {
    let server = http.createServer();
    const handle = (result) => () => {
      server.close();
      resolve(result);
    };
    server.once("error", handle(false));
    server.once("listening", handle(true));
    server.listen(port);
  });
};
var getRandomPort = (min = 5e4, max = 65535) => min + Math.floor(Math.random() * (max - min));
var getOpenPort = async (port = getRandomPort()) => {
  const isOpen = await isPortOpen(port);
  if (isOpen)
    return port;
  return getOpenPort(port + 1);
};
var liveview = async (cb, autoStart = false, identifier) => addToQueueSimple(identifier, async () => {
  let capture;
  let response;
  let stopPromise = null;
  const isRunning = () => !!(capture || response);
  const start = async () => {
    if (isRunning()) {
      await stop();
    }
    const uniqueId = ("0".repeat(10) + Math.random().toString(36).slice(2)).slice(-10);
    const port = await getOpenPort();
    const url = `http://localhost:${port}/${uniqueId}.jpg`;
    const cmd = `gphoto2 ${getIdentifierFlags(identifier)} --capture-movie --stdout | ffmpeg -re -i pipe:0 -listen 1 -f mjpeg ${url}`;
    try {
      capture = runCmdUnqueued(cmd, void 0, true);
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
          await wait(seconds2(0.5));
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
  };
  const result = { start, stop, isRunning };
  await liveviewStore.add(identifier, result);
  if (autoStart) {
    await start();
  }
  return result;
});

// src/commands/capture.ts
var image = async (options = {}, identifier) => {
  const mainFlag = options.download !== false ? "--capture-image-and-download" : "--capture-image";
  const flags = getFlags(options);
  const cmd = `gphoto2 ${getIdentifierFlags(identifier)} ${mainFlag} ${flags} --force-overwrite`;
  await getWait(options);
  const out = await runCmd(cmd, identifier, options.directory);
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
  const out = await runCmd(cmd, identifier, options.directory);
  return parseCaptureStdout(out, options.directory);
};

// src/queue-public.ts
var queue_public_exports = {};
__export(queue_public_exports, {
  disable: () => disable,
  disableLiveviewManagement: () => disableLiveviewManagement,
  enable: () => enable,
  enableLiveviewManagement: () => enableLiveviewManagement,
  isLiveviewManagementEnabled: () => isLiveviewManagementEnabled,
  isQueueEnabled: () => isQueueEnabled,
  setPauseTime: () => setPauseTime
});

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
  const out = await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --abilities `, identifier);
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
import { PromiseUtils } from "swiss-ak";
var autoDetect = async () => {
  const out = await runCmdUnqueued("gphoto2 --auto-detect");
  const cameras = readTable(out, ["model", "port"]);
  return cameras;
};
var getSerial = async (identifier) => {
  const [serial] = await getValues(["serialnumber"], false, identifier);
  return serial;
};
var autoDetectWithSerials = async () => {
  const cameras = await autoDetect();
  return PromiseUtils.mapLimit(4, cameras, async (camera) => {
    const serial = await getSerial(camera);
    return { ...camera, serial };
  });
};
var getIdentifierForSerial = async (serial) => {
  const cameras = await autoDetectWithSerials();
  const camera = cameras.find((camera2) => camera2.serial === serial);
  return camera;
};

// src/commands/autofocus.ts
import { ObjectUtils as ObjectUtils3, tryOr, zip as zip3 } from "swiss-ak";
var findBestAFMode = (info, initial) => {
  return info.choices.find((choice) => choice.toLowerCase().startsWith("af-s")) || info.choices.find((choice) => choice.toLowerCase().startsWith("af")) || info.choices.find((choice) => choice.toLowerCase().startsWith("a")) || initial;
};
var autofocus = async (overrideManual, identifier) => pauseLiveviewWrapper(identifier, async () => {
  const keys = await findAppropriateConfigKeys(["focusmode", "focusmode2"], identifier);
  const [autofocusdriveKey] = await findAppropriateConfigKeys(["autofocusdrive"], identifier);
  let original = keys.map(() => void 0);
  if (overrideManual) {
    const { info, values } = await get(keys, true, identifier);
    const modeInfos = keys.map((key) => info[key]);
    const modeValues = keys.map((key) => values[key]);
    if (modeValues.some((v) => v && v.toLowerCase().startsWith("m"))) {
      original = modeValues;
      const newModeValues = keys.map(
        (key, i) => {
          var _a;
          return ((_a = modeValues[i]) == null ? void 0 : _a.toLowerCase().startsWith("m")) ? findBestAFMode(modeInfos[i], modeValues[i]) : void 0;
        }
      );
      const newValues = Object.fromEntries(zip3(keys, newModeValues));
      await setValues(ObjectUtils3.clean(newValues), true, identifier);
    }
  }
  await tryOr(void 0, () => setValues({ [autofocusdriveKey]: true }, true, identifier));
  if (overrideManual && original.some((v) => v !== void 0)) {
    const newValues = Object.fromEntries(zip3(keys, original));
    await setValues(ObjectUtils3.clean(newValues), true, identifier);
  }
});

// src/commands/listCameras.ts
var listCameras = async () => {
  const out = await runCmdUnqueued("gphoto2 --list-cameras");
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
  const out = await runCmdUnqueued("gphoto2 --list-ports");
  const cameras = readTable(out, ["path", "description"]);
  return cameras;
};

// src/commands/reset.ts
import { wait as wait2 } from "swiss-ak";
var reset = async (identifier) => {
  const serial = await getSerial(identifier);
  await runCmd(`gphoto2 ${getIdentifierFlags(identifier)} --reset`, identifier);
  const result = await getIdentifierForSerial(serial);
  await wait2(50);
  return result;
};

// src/index.ts
var src_default = gPhoto_exports;
export {
  abilities,
  autoDetect,
  autoDetectWithSerials,
  autofocus,
  capture_exports as capture,
  config_exports as config,
  src_default as default,
  getIdentifierForSerial,
  getSerial,
  listCameras,
  listPorts,
  queue_public_exports as queue,
  reset,
  setErrorHandler
};
