[gphoto](../API.md) / config

# Namespace: config

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

▸ **get**(`keys`, `identifier?`): `Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

#### Defined in

[commands/config.ts:56](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L56)

___

### getAll

▸ **getAll**(`identifier?`): `Promise`<{ `info`: [`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md) ; `values`: [`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<{ `info`: [`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md) ; `values`: [`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)  }\>

#### Defined in

[commands/config.ts:16](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L16)

___

### getAllInfos

▸ **getAllInfos**(`identifier?`): `Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

#### Defined in

[commands/config.ts:29](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L29)

___

### getAllValues

▸ **getAllValues**(`identifier?`): `Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigValueObj`](../interfaces/GPhotoConfigValueObj.md)\>

#### Defined in

[commands/config.ts:36](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L36)

___

### getInfos

▸ **getInfos**(`keys`, `identifier?`): `Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigInfoObj`](../interfaces/GPhotoConfigInfoObj.md)\>

#### Defined in

[commands/config.ts:43](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L43)

___

### getSingle

▸ **getSingle**(`key`, `identifier?`): `Promise`<[`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype)\>

#### Defined in

[commands/config.ts:63](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L63)

___

### getSingleInfo

▸ **getSingleInfo**(`key`, `identifier?`): `Promise`<[`GPhotoConfigInfo`](../interfaces/GPhotoConfigInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<[`GPhotoConfigInfo`](../interfaces/GPhotoConfigInfo.md)\>

#### Defined in

[commands/config.ts:50](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L50)

___

### list

▸ **list**(`identifier?`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[commands/config.ts:69](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L69)

___

### set

▸ **set**(`values`, `identifier?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Object` |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[commands/config.ts:79](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L79)

___

### setSingle

▸ **setSingle**(`key`, `value`, `identifier?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | [`GPhotoConfigDataType`](../API.md#gphotoconfigdatatype) |
| `identifier?` | [`GPhotoIdentifier`](../interfaces/GPhotoIdentifier.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[commands/config.ts:100](https://github.com/jackcannon/gphoto/blob/737a9c8/src/commands/config.ts#L100)
