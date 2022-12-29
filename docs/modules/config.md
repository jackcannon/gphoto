[gphoto](../API.md) / config

# Namespace: config

A collection of functions for managing the configuration of a camera.

## Table of contents

### Functions

- [get](config.md#get)
- [getAll](config.md#getall)
- [getAllInfo](config.md#getallinfo)
- [getAllValues](config.md#getallvalues)
- [getInfo](config.md#getinfo)
- [getValues](config.md#getvalues)
- [getValuesAsObj](config.md#getvaluesasobj)
- [list](config.md#list)
- [setValues](config.md#setvalues)

## Functions

### get

**get**(`keys`, `checkIfMissing?`, `identifier?`): `Promise`<{ `info`: [`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md) ; `values`: [`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)  }\>

Get the info and values for the provided list of configuration options available on the camera.

If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()

```ts
import gPhoto from 'gphoto';

const {info, values} = await gPhoto.config.get([
  '/main/imgsettings/iso',
  '/main/capturesettings/shutterspeed2'
]);

values['/main/imgsettings/iso']; // '100'
info['/main/imgsettings/iso'].readonly; // false
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keys` | `string`[] | `undefined` |
| `checkIfMissing` | `boolean` | `false` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) | `undefined` |

#### Returns

`Promise`<{ `info`: [`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md) ; `values`: [`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)  }\>

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

### getInfo

**getInfo**(`keys`, `checkIfMissing?`, `identifier?`): `Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

Get the info for the provided list of configuration options available on the camera.

If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()

```ts
import gPhoto from 'gphoto';

const info = await gPhoto.config.getInfo([
  '/main/imgsettings/iso',
  '/main/capturesettings/shutterspeed2'
]);

info['/main/imgsettings/iso'].readonly; // false
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keys` | `string`[] | `undefined` |
| `checkIfMissing` | `boolean` | `false` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) | `undefined` |

#### Returns

`Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

___

### getValues

**getValues**(`keys`, `checkIfMissing?`, `identifier?`): `Promise`<[`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype)[]\>

Get the values for the provided list of configuration options available on the camera.
Returns an array with the values in the same order as the keys provided. Values for invalid keys will be `undefined`.

If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()

```ts
import gPhoto from 'gphoto';

const values = await gPhoto.config.getValues([
  '/main/imgsettings/iso',
  '/main/capturesettings/shutterspeed2'
]);

values[0]; // '100'

const [iso] = values;
iso; // '100'
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keys` | `string`[] | `undefined` |
| `checkIfMissing` | `boolean` | `false` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) | `undefined` |

#### Returns

`Promise`<[`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype)[]\>

___

### getValuesAsObj

**getValuesAsObj**(`keys`, `checkIfMissing?`, `identifier?`): `Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

Get the values for the provided list of configuration options available on the camera.
Returns an object with the keys being the config keys and the values being the config values.

If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()

```ts
import gPhoto from 'gphoto';

const values = await gPhoto.config.getValuesAsObj([
  '/main/imgsettings/iso',
  '/main/capturesettings/shutterspeed2'
]);

values['/main/imgsettings/iso']; // '100'

const {['/main/imgsettings/iso'] as iso} = values;
iso; // '100'
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keys` | `string`[] | `undefined` |
| `checkIfMissing` | `boolean` | `false` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) | `undefined` |

#### Returns

`Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

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

### setValues

**setValues**(`values`, `checkIfMissing?`, `identifier?`): `Promise`<`void`\>

Set values for multiple configuration options on the camera.

If `checkIfMissing` is `true`, then this function will filter out any keys that are not present in config.list()

```ts
import gPhoto from 'gphoto';

await gPhoto.config.getValues(['/main/imgsettings/iso']); // ['100']

await gPhoto.config.setValues({
  '/main/imgsettings/iso': '200',
  '/main/capturesettings/shutterspeed2': '1/100'
});

await gPhoto.config.getValues(['/main/imgsettings/iso']); // ['200']
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `values` | `Object` | `undefined` |
| `checkIfMissing` | `boolean` | `false` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) | `undefined` |

#### Returns

`Promise`<`void`\>
