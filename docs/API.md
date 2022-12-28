gphoto

# gphoto

## Table of contents

### Namespaces

- [config](modules/config.md)

### Interfaces

- [GPhotoAbilities](interfaces/GPhotoAbilities.md)
- [GPhotoAutoDetectCamera](interfaces/GPhotoAutoDetectCamera.md)
- [GPhotoConfigInfo](interfaces/GPhotoConfigInfo.md)
- [GPhotoConfigInfoObj](interfaces/GPhotoConfigInfoObj.md)
- [GPhotoConfigValueObj](interfaces/GPhotoConfigValueObj.md)
- [GPhotoIdentifier](interfaces/GPhotoIdentifier.md)
- [GPhotoListedPort](interfaces/GPhotoListedPort.md)
- [GPhotoSupportedCamera](interfaces/GPhotoSupportedCamera.md)

### Type Aliases

- [GPhotoConfigDataType](API.md#gphotoconfigdatatype)
- [GPhotoConfigType](API.md#gphotoconfigtype)

### Functions

- [abilities](API.md#abilities)
- [autoDetect](API.md#autodetect)
- [listCameras](API.md#listcameras)
- [listPorts](API.md#listports)
- [reset](API.md#reset)

## Type Aliases

### GPhotoConfigDataType

 **GPhotoConfigDataType**: `string` \| `number` \| `boolean` \| `Date`

___

### GPhotoConfigType

 **GPhotoConfigType**: ``"DATE"`` \| ``"MENU"`` \| ``"RADIO"`` \| ``"RANGE"`` \| ``"TEXT"`` \| ``"TOGGLE"``

## Functions

### abilities

**abilities**(`identifier?`): `Promise`<[`GPhotoAbilities`](interfaces/GPhotoAbilities.md)\>

Display the camera and driver abilities specified in the libgphoto2 driver.
This all does not query the camera, it uses data provided by the libgphoto2 library.

**`Example`**

```typescript
import gPhoto from 'gphoto';
const abilities = await gPhoto.abilities();
console.log(abilities);

// {
//   'Abilities for camera': 'Nikon DSC D5200',
//   'Serial port support': false,
//   'USB support': true,
//   'Capture choices': [ 'Image', 'Preview', 'Trigger Capture' ],
//   'Configuration support': true,
//   'Delete selected files on camera': true,
//   'Delete all files on camera': false,
//   'File preview (thumbnail) support': true,
//   'File upload support': false
// }

```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoAbilities`](interfaces/GPhotoAbilities.md)\>

___

### autoDetect

**autoDetect**(): `Promise`<[`GPhotoAutoDetectCamera`](interfaces/GPhotoAutoDetectCamera.md)[]\>

#### Returns

`Promise`<[`GPhotoAutoDetectCamera`](interfaces/GPhotoAutoDetectCamera.md)[]\>

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
