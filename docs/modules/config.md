[gphoto](../README.md) / [Exports](../modules.md) / config

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

▸ **get**(`keys`, `identifier?`): `Promise`<`GPhotoConfigValueObj`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`GPhotoConfigValueObj`\>

#### Defined in

[commands/config.ts:56](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L56)

___

### getAll

▸ **getAll**(`identifier?`): `Promise`<{ `info`: `GPhotoConfigInfoObj` ; `values`: `GPhotoConfigValueObj`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<{ `info`: `GPhotoConfigInfoObj` ; `values`: `GPhotoConfigValueObj`  }\>

#### Defined in

[commands/config.ts:16](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L16)

___

### getAllInfos

▸ **getAllInfos**(`identifier?`): `Promise`<`GPhotoConfigInfoObj`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`GPhotoConfigInfoObj`\>

#### Defined in

[commands/config.ts:29](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L29)

___

### getAllValues

▸ **getAllValues**(`identifier?`): `Promise`<`GPhotoConfigValueObj`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`GPhotoConfigValueObj`\>

#### Defined in

[commands/config.ts:36](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L36)

___

### getInfos

▸ **getInfos**(`keys`, `identifier?`): `Promise`<`GPhotoConfigInfoObj`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`GPhotoConfigInfoObj`\>

#### Defined in

[commands/config.ts:43](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L43)

___

### getSingle

▸ **getSingle**(`key`, `identifier?`): `Promise`<`GPhotoConfigDataType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`GPhotoConfigDataType`\>

#### Defined in

[commands/config.ts:63](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L63)

___

### getSingleInfo

▸ **getSingleInfo**(`key`, `identifier?`): `Promise`<`GPhotoConfigInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`GPhotoConfigInfo`\>

#### Defined in

[commands/config.ts:50](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L50)

___

### list

▸ **list**(`identifier?`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[commands/config.ts:69](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L69)

___

### set

▸ **set**(`values`, `identifier?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Object` |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`void`\>

#### Defined in

[commands/config.ts:79](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L79)

___

### setSingle

▸ **setSingle**(`key`, `value`, `identifier?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `GPhotoConfigDataType` |
| `identifier?` | `GPhotoIdentifier` |

#### Returns

`Promise`<`void`\>

#### Defined in

[commands/config.ts:100](https://github.com/jackcannon/gphoto/blob/ab4811e/src/commands/config.ts#L100)
