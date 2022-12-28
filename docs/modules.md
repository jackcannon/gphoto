[gphoto](README.md) / Exports

# gphoto

## Table of contents

### Namespaces

- [config](modules/config.md)

### Interfaces

- [GPhotoAbilities](interfaces/GPhotoAbilities.md)

### Functions

- [abilities](modules.md#abilities)
- [autoDetect](modules.md#autodetect)
- [listCameras](modules.md#listcameras)
- [listPorts](modules.md#listports)
- [reset](modules.md#reset)

## Functions

### abilities

▸ **abilities**(`identifier?`): `Promise`<[`GPhotoAbilities`](interfaces/GPhotoAbilities.md)\>

gPhoto.abilities

Display the camera and driver abilities specified in the libgphoto2 driver.
This all does not query the camera, it uses data provided by the libgphoto2 library.

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
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<[`GPhotoAbilities`](interfaces/GPhotoAbilities.md)\>

#### Defined in

[commands/abilities.ts:74](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/abilities.ts#L74)

___

### autoDetect

▸ **autoDetect**(): `Promise`<`GPhotoAutoDetectCamera`[]\>

#### Returns

`Promise`<`GPhotoAutoDetectCamera`[]\>

#### Defined in

[commands/autoDetect.ts:10](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/autoDetect.ts#L10)

___

### listCameras

▸ **listCameras**(): `Promise`<`GPhotoSupportedCamera`[]\>

#### Returns

`Promise`<`GPhotoSupportedCamera`[]\>

#### Defined in

[commands/listCameras.ts:9](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/listCameras.ts#L9)

___

### listPorts

▸ **listPorts**(): `Promise`<`GPhotoListedPort`[]\>

#### Returns

`Promise`<`GPhotoListedPort`[]\>

#### Defined in

[commands/listPorts.ts:10](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/listPorts.ts#L10)

___

### reset

▸ **reset**(`identifier?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`void`\>

#### Defined in

[commands/reset.ts:6](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/reset.ts#L6)
