[gphoto](../API.md) / capture

# Namespace: capture

A collection of functions for capturing files with a camera.

## Table of contents

### Functions

- [image](capture.md#image)
- [liveview](capture.md#liveview)
- [preview](capture.md#preview)

### Interfaces

- [GPhotoCaptureOptions](../interfaces/capture.GPhotoCaptureOptions.md)
- [GPhotoLiveview](../interfaces/capture.GPhotoLiveview.md)
- [SaveLocation](../interfaces/capture.SaveLocation.md)

### Type Aliases

- [GPhotoCaptureKeep](capture.md#gphotocapturekeep)
- [SaveLocationType](capture.md#savelocationtype)

## Functions

### image

**image**(`options?`, `identifier?`): `Promise`<[`SaveLocation`](../interfaces/capture.SaveLocation.md)[]\>

Capture an image from the camera.

```ts
import gPhoto from 'gphoto';

const files = await gPhoto.capture.image({
  download: true,
  keep: 'raw',
  filename: 'test-%n.%C',
});
// 'test-1.JPG' saved to current directory
// 'DSC_0001.NEF' saved to camera

files;
// [
//   {
//     type: 'local',
//     dir: '/Users/user/cool-project',
//     filename: 'image-1.JPG',
//     full: '/Users/user/cool-project/test-1.JPG'
//   },
//   {
//     type: 'camera',
//     dir: '/store_00010001/DCIM/100D5200',
//     filename: 'DSC_0001.NEF',
//     full: '/store_00010001/DCIM/100D5200/DSC_0001.NEF'
//   }
// ]
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`GPhotoCaptureOptions`](../interfaces/capture.GPhotoCaptureOptions.md) |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`SaveLocation`](../interfaces/capture.SaveLocation.md)[]\>

___

### liveview

**liveview**(`cb`, `autoStart?`, `identifier?`): `Promise`<[`GPhotoLiveview`](../interfaces/capture.GPhotoLiveview.md)\>

Operate a liveview preview stream from the camera.

```ts
const liveview = await gPhoto.capture.liveview(async (frame: Buffer) => {
  // do something with the frame; display it, save it, bake it in a pie, whatever
}, true);

// ...

await liveview.stop();
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cb` | (`frame`: `Buffer`) => `void` | `undefined` |
| `autoStart` | `boolean` | `false` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) | `undefined` |

#### Returns

`Promise`<[`GPhotoLiveview`](../interfaces/capture.GPhotoLiveview.md)\>

___

### preview

**preview**(`options?`, `identifier?`): `Promise`<[`SaveLocation`](../interfaces/capture.SaveLocation.md)[]\>

Capture a quick preview image from the camera.

```ts
import gPhoto from 'gphoto';

const files = await gPhoto.capture.preview({
  filename: 'preview-%n.%C'
});
// 'thumb_preview-1.jpg' saved to current directory

files;
// [
//   {
//     type: 'local',
//     dir: '/Users/user/cool-project',
//     filename: 'thumb_preview-1.jpg',
//     full: '/Users/user/cool-project/thumb_preview-1.jpg'
//   }
// ]
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`GPhotoCaptureOptions`](../interfaces/capture.GPhotoCaptureOptions.md) |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`SaveLocation`](../interfaces/capture.SaveLocation.md)[]\>

## Type Aliases

### GPhotoCaptureKeep

 **GPhotoCaptureKeep**: `boolean` \| ``"raw"``

Used GPhotoCaptureOptions.keep

| Value   | Description                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------- |
| `true`  | Keep the images on the memory card of the camera.                                                       |
| `false` | Don't keep the images on the memory card of the camera after downloading them during capture. (default) |
| `'raw'` | Keep the RAW images on the memory card of the camera, but still download the JPEG images.               |

___

### SaveLocationType

 **SaveLocationType**: ``"camera"`` \| ``"local"``

Whether a file was saved to the camera or downloaded to the local machine.
