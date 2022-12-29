gphoto

# gphoto

## Table of contents

### Namespaces

- [capture](modules/capture.md)
- [config](modules/config.md)
- [default](modules/default.md)

### Functions

- [abilities](API.md#abilities)
- [autoDetect](API.md#autodetect)
- [autofocus](API.md#autofocus)
- [listCameras](API.md#listcameras)
- [listPorts](API.md#listports)
- [reset](API.md#reset)

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

## Functions

### abilities

**abilities**(`identifier?`): `Promise`<[`GPhotoAbilities`](interfaces/GPhotoAbilities.md)\>

Display the camera and driver abilities specified in the libgphoto2 driver.
This all does not query the camera, it uses data provided by the libgphoto2 library.

```ts
import gPhoto from 'gphoto';
const abilities = await gPhoto.abilities();

console.log(abilities.captureChoices.includes('Image')); // true
console.log(abilties.captureChoices.includes('Video')); // false
console.log(abilties.deleteSelectedFilesOnCamera); // true
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

**reset**(`identifier?`): `Promise`<`void`\>

Resets the USB port of the camera.

This command resets the USB port of the camera.
This option is useful if somehow the protocol talking to the camera locked up
and simulates plugging out and in the camera.

```ts
import gPhoto from 'gphoto';

await gPhoto.reset(); // camera is disconnected and reconnected
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`void`\>

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
