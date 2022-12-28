gphoto

# gphoto

## Table of contents

### Namespaces

- [config](modules/config.md)
- [default](modules/default.md)

### Functions

- [abilities](API.md#abilities)
- [autoDetect](API.md#autodetect)
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
import * as gPhoto from 'gphoto';
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
import {autoDetect} from 'gphoto';

const cameras = await autoDetect();
```

#### Returns

`Promise`<[`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md)[]\>

___

### listCameras

**listCameras**(): `Promise`<[`GPhotoSupportedCamera`](interfaces/GPhotoSupportedCamera.md)[]\>

#### Returns

`Promise`<[`GPhotoSupportedCamera`](interfaces/GPhotoSupportedCamera.md)[]\>

___

### listPorts

**listPorts**(): `Promise`<[`GPhotoListedPort`](interfaces/GPhotoListedPort.md)[]\>

#### Returns

`Promise`<[`GPhotoListedPort`](interfaces/GPhotoListedPort.md)[]\>

___

### reset

**reset**(`identifier?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`void`\>

## Type Aliases

### GPhotoConfigDataType

 **GPhotoConfigDataType**: `string` \| `number` \| `boolean` \| `Date`

___

### GPhotoConfigType

 **GPhotoConfigType**: ``"DATE"`` \| ``"MENU"`` \| ``"RADIO"`` \| ``"RANGE"`` \| ``"TEXT"`` \| ``"TOGGLE"``
