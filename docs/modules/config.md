[gphoto](../API.md) / config

# Namespace: config

A collection of functions for managing the configuration of a camera.

## Table of contents

### Functions

- [get](config.md#get)
- [getAll](config.md#getall)
- [getAllInfos](config.md#getallinfos)
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

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<{ `info`: [`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md) ; `values`: [`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)  }\>

___

### getAllInfos

**getAllInfos**(`identifier?`): `Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

___

### getAllValues

**getAllValues**(`identifier?`): `Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

___

### getInfos

**getInfos**(`keys`, `identifier?`): `Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`string`[]\>

___

### set

**set**(`values`, `identifier?`): `Promise`<`void`\>

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | [`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype) |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`void`\>
