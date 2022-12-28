[gphoto](../API.md) / config

# Namespace: config

A collection of functions for managing the configuration of a camera.

## Table of contents

### Functions

- [get](config.md#get)
- [getAll](config.md#getall)
- [getAllInfo](config.md#getallinfo)
- [getAllValues](config.md#getallvalues)
- [getInfos](config.md#getinfos)
- [getSingle](config.md#getsingle)
- [getSingleInfo](config.md#getsingleinfo)
- [list](config.md#list)
- [set](config.md#set)
- [setSingle](config.md#setsingle)

## Functions

### get

**get**(`keys`, `identifier?`): `Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

Get the values for the provided list of configuration options available on the camera.

```ts
import gPhoto from 'gphoto';

const values = await gPhoto.config.get([
  '/main/imgsettings/iso',
  '/main/capturesettings/shutterspeed2'
]);

values['/main/imgsettings/iso']; // '100'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

___

### getAll

**getAll**(`identifier?`): `Promise`<{ `info`: [`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md) ; `values`: [`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)  }\>

Get the info and values for all the configuration options available on the camera.

```ts
import gPhoto from 'gphoto';

const {info, values} = await gPhoto.config.getAll();

values['/main/imgsettings/iso']; // '100'
info['/main/imgsettings/iso'].readonly; // false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<{ `info`: [`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md) ; `values`: [`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)  }\>

___

### getAllInfo

**getAllInfo**(`identifier?`): `Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

Get the info for all the configuration options available on the camera.

```ts
import gPhoto from 'gphoto';

const info = await gPhoto.config.getAllInfo();

info['/main/imgsettings/iso'].readonly; // false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

___

### getAllValues

**getAllValues**(`identifier?`): `Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

Get the values for all the configuration options available on the camera.

```ts
import gPhoto from 'gphoto';

const values = await gPhoto.config.getAllValues();

values['/main/imgsettings/iso']; // '100'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

___

### getInfos

**getInfos**(`keys`, `identifier?`): `Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

Get the info for the provided list of configuration options available on the camera.

```ts
import gPhoto from 'gphoto';

const info = await gPhoto.config.getInfos([
  '/main/imgsettings/iso',
  '/main/capturesettings/shutterspeed2'
]);

info['/main/imgsettings/iso'].readonly; // false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

___

### getSingle

**getSingle**(`key`, `identifier?`): `Promise`<[`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype)\>

Get the value for a single configuration option available on the camera.

Hint: use ```get``` or ```getAllValues``` instead if you need to get multiple options at once.

```ts
import gPhoto from 'gphoto';

const value = await gPhoto.config.getSingle('/main/imgsettings/iso');

value; // '100'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype)\>

___

### getSingleInfo

**getSingleInfo**(`key`, `identifier?`): `Promise`<[`GPhotoConfigInfo`](../interfaces/GPhotoConfigInfo.md)\>

Get the info for a single configuration option available on the camera.

Hint: use ```getInfos``` or ```getAllInfos``` instead if you need to get multiple options at once.

```ts
import gPhoto from 'gphoto';

const info = await gPhoto.config.getSingleInfo('/main/imgsettings/iso');

info.readonly; // false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigInfo`](../interfaces/GPhotoConfigInfo.md)\>

___

### list

**list**(`identifier?`): `Promise`<`string`[]\>

Get a list of all the configuration option keys available on the camera.

```ts
import gPhoto from 'gphoto';

const keys = await gPhoto.config.list();

keys; // ['/main/imgsettings/iso', '/main/capturesettings/shutterspeed2', ...]
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`string`[]\>

___

### set

**set**(`values`, `identifier?`): `Promise`<`void`\>

Set values for multiple configuration options on the camera.

```ts
import gPhoto from 'gphoto';

await gPhoto.config.getSingle('/main/imgsettings/iso'); // '100'

await gPhoto.config.set({
  '/main/imgsettings/iso': '200',
  '/main/capturesettings/shutterspeed2': '1/100'
});

await gPhoto.config.getSingle('/main/imgsettings/iso'); // '200'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Object` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`void`\>

___

### setSingle

**setSingle**(`key`, `value`, `identifier?`): `Promise`<`void`\>

Set the value of a single configuration option on the camera.

Hint: use ```set``` instead if you need to set multiple options at once.

```ts
import gPhoto from 'gphoto';

await gPhoto.config.getSingle('/main/imgsettings/iso'); // '100'

await gPhoto.config.setSingle('/main/imgsettings/iso', '200');

await gPhoto.config.getSingle('/main/imgsettings/iso'); // '200'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | [`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype) |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`void`\>
