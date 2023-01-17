gphoto

# gphoto

## Table of contents

### References

- [GPhotoCaptureKeep](API.md#gphotocapturekeep)
- [GPhotoCaptureOptions](API.md#gphotocaptureoptions)
- [GPhotoLiveview](API.md#gphotoliveview)
- [SaveLocation](API.md#savelocation)
- [SaveLocationType](API.md#savelocationtype)

### Namespaces

- [capture](modules/capture.md)
- [config](modules/config.md)
- [default](modules/default.md)
- [queue](modules/queue.md)

### Functions

- [abilities](API.md#abilities)
- [autoDetect](API.md#autodetect)
- [autoDetectWithSerials](API.md#autodetectwithserials)
- [autofocus](API.md#autofocus)
- [getIdentifierForSerial](API.md#getidentifierforserial)
- [getSerial](API.md#getserial)
- [listCameras](API.md#listcameras)
- [listPorts](API.md#listports)
- [reset](API.md#reset)
- [resetAll](API.md#resetall)
- [setDebugging](API.md#setdebugging)
- [setErrorHandler](API.md#seterrorhandler)

### Interfaces

- [GPhotoAbilities](interfaces/GPhotoAbilities.md)
- [GPhotoConfigInfo](interfaces/GPhotoConfigInfo.md)
- [GPhotoConfigInfoObj](interfaces/GPhotoConfigInfoObj.md)
- [GPhotoConfigValueObj](interfaces/GPhotoConfigValueObj.md)
- [GPhotoIdentifier](interfaces/GPhotoIdentifier.md)
- [GPhotoListedPort](interfaces/GPhotoListedPort.md)
- [GPhotoSupportedCamera](interfaces/GPhotoSupportedCamera.md)

### Type Aliases

- [GPhotoConfigDataType](API.md#gphotoconfigdatatype)
- [GPhotoConfigType](API.md#gphotoconfigtype)
- [GPhotoErrorHandler](API.md#gphotoerrorhandler)

## References

### GPhotoCaptureKeep

Re-exports [GPhotoCaptureKeep](modules/capture.md#gphotocapturekeep)

___

### GPhotoCaptureOptions

Re-exports [GPhotoCaptureOptions](interfaces/capture.GPhotoCaptureOptions.md)

___

### GPhotoLiveview

Re-exports [GPhotoLiveview](interfaces/capture.GPhotoLiveview.md)

___

### SaveLocation

Re-exports [SaveLocation](interfaces/capture.SaveLocation.md)

___

### SaveLocationType

Re-exports [SaveLocationType](modules/capture.md#savelocationtype)

## Functions

### abilities

**abilities**(`identifier?`): `Promise`<[`GPhotoAbilities`](interfaces/GPhotoAbilities.md)\>

Display the camera and driver abilities specified in the libgphoto2 driver.
This all does not query the camera, it uses data provided by the libgphoto2 library.

```ts
import gPhoto from 'gphoto';
const abilities = await gPhoto.abilities();

abilities.captureChoices.includes('Image'); // true
abilties.captureChoices.includes('Video'); // false
abilties.deleteSelectedFilesOnCamera; // true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoAbilities`](interfaces/GPhotoAbilities.md)\>

___

### autoDetect

**autoDetect**(): `Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)[]\>

Returns a list of connected cameras

```ts
import gPhoto from 'gphoto';

const cameras = await gPhoto.autoDetect();

await gPhoto.config.set({ '/main/imgsettings/iso': '2000' }, cameras[0]);
await gPhoto.config.set({ '/main/imgsettings/iso': '2500' }, cameras[1]);
```

#### Returns

`Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)[]\>

___

### autoDetectWithSerials

**autoDetectWithSerials**(): `Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)[]\>

Returns a list of connected cameras, with their respective serial numbers

```ts
import gPhoto from 'gphoto';

const cameras = await gPhoto.autoDetectWithSerials();
cameras[0].serial; // 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
```

#### Returns

`Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)[]\>

___

### autofocus

**autofocus**(`overrideManual`, `identifier?`): `Promise`<`void`\>

Auto-focus the camera (without taking a picture)

if `overrideManual` is true, and camera is in manual focusing mode, then it will override the manual focus setting, focus the camera, and return to the original focus mode setting

Overriding may or may not work, depending on the camera.

```ts
import gPhoto from 'gphoto';

await gPhoto.config.setValues({ '/main/capturesettings/focusmode': 'AF-C' }, true); // sets camera to auto focus (continuous) mode
await gPhoto.autofocus(); // camera will autofocus

// ...

await gPhoto.config.setValues({ '/main/capturesettings/focusmode': 'Manual' }, true); // sets camera to manual focus mode
await gPhoto.autofocus(); // focus won't change

await gPhoto.autofocus(true); // camera will autofocus
// focus mode will still be set to manual

```

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrideManual` | `boolean` |
| `identifier?` | [`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`void`\>

___

### getIdentifierForSerial

**getIdentifierForSerial**(`serial`): `Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)\>

Get the identifier for a camera with a given serial number

```ts
import gPhoto from 'gphoto';

const serial = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const identifier = await gPhoto.getIdentifierForSerial(serial);
identifier.port; // 'usb:XXX,XXX'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)\>

___

### getSerial

**getSerial**(`identifier?`): `Promise`<`string`\>

Get the serial number of a camera

```ts
import gPhoto from 'gphoto';

const serial = await gPhoto.getSerial();
serial; // 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`string`\>

___

### listCameras

**listCameras**(): `Promise`<[`GPhotoSupportedCamera`](interfaces/GPhotoSupportedCamera.md)[]\>

List supported camera models.

```ts
import gPhoto from 'gphoto';

const cameras = await gPhoto.listCameras();
cameras; // [{ model: 'Canon EOS 5D Mark IV' }, ...]
```

#### Returns

`Promise`<[`GPhotoSupportedCamera`](interfaces/GPhotoSupportedCamera.md)[]\>

___

### listPorts

**listPorts**(): `Promise`<[`GPhotoListedPort`](interfaces/GPhotoListedPort.md)[]\>

List supported port devices.

```ts
import gPhoto from 'gphoto';

const ports = await gPhoto.listPorts();
ports; // [{ path: 'usb:001,003', description: 'USB PTP Class Camera' }, ...]
```

#### Returns

`Promise`<[`GPhotoListedPort`](interfaces/GPhotoListedPort.md)[]\>

___

### reset

**reset**(`identifier?`): `Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)\>

Resets the USB port of the camera.

This command resets the USB port of the camera.
This option is useful if somehow the protocol talking to the camera locked up
and simulates plugging out and in the camera.

Resetting the camera will change the port it is connected to, affecting the `port` property of the `GPhotoIdentifier` object.
To maintain consistency, a new `GPhotoIdentifier` object is returned, with an updated `port` property.
This is quite a timely operation, so it is recommended to use sparingly.

```ts
import gPhoto from 'gphoto';

await gPhoto.reset(); // camera is disconnected and reconnected
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)\>

___

### resetAll

**resetAll**(): `Promise`<`void`\>

Resets all the cameras connected to the device.

Resetting the camera will change the port it is connected to, affecting the `port` property of the `GPhotoIdentifier` object.
No new `GPhotoIdentifier` object is returned, so consider any existing `GPhotoIdentifier` objects invalid.

```ts
import gPhoto from 'gphoto';

await gPhoto.resetAll(); // all cameras are disconnected and reconnected
```

#### Returns

`Promise`<`void`\>

___

### setDebugging

**setDebugging**(`debug`): `void`

Turn on debugging mode, so that commands are printed as they are run.
Useful for debugging.

#### Parameters

| Name | Type |
| :------ | :------ |
| `debug` | `boolean` |

#### Returns

`void`

___

### setErrorHandler

**setErrorHandler**(`fn`): `void`

Set a function for handling gphoto2 errors.

On error, the provided function receives a short error message and the full stderr output.

It must return a boolean indicating whether the error should be resolved or rejected.

It can be async.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`GPhotoErrorHandler`](API.md#gphotoerrorhandler) |

#### Returns

`void`

## Type Aliases

### GPhotoConfigDataType

 **GPhotoConfigDataType**: `string` \| `number` \| `boolean` \| `Date`

Possible data types for a config value.

___

### GPhotoConfigType

 **GPhotoConfigType**: ``"DATE"`` \| ``"MENU"`` \| ``"RADIO"`` \| ``"RANGE"`` \| ``"TEXT"`` \| ``"TOGGLE"``

Possible types of a config.

| Value    | Date Type         | Description                   |
| -------- | ----------------- | ----------------------------- |
| 'DATE'   | `Date` or `'now'` | A date value                  |
| 'MENU'   | `string`          | Has a list of choices         |
| 'RADIO'  | `string`          | Has a list of choices         |
| 'RANGE'  | `number`          | A number value within a range |
| 'TEXT'   | `string`          | A text value                  |
| 'TOGGLE' | `boolean`         | An on/off value               |

___

### GPhotoErrorHandler

 **GPhotoErrorHandler**: (`short`: `string`, `long`: `string`) => `Promise`<`boolean`\> \| `boolean`

#### Type declaration

(`short`, `long`): `Promise`<`boolean`\> \| `boolean`

Function for handling gphoto2 errors.

Receives a short error message and the full stderr output.

Must return a boolean indicating whether the error should be resolved or rejected.

Can be async.

##### Parameters

| Name | Type |
| :------ | :------ |
| `short` | `string` |
| `long` | `string` |

##### Returns

`Promise`<`boolean`\> \| `boolean`
