[gphoto](../API.md) / GPhotoConfigInfo

# Interface: GPhotoConfigInfo

The information about a configuration option.
Contains details on how to display and edit the value.

## Table of contents

### Properties

- [choices](GPhotoConfigInfo.md#choices)
- [help](GPhotoConfigInfo.md#help)
- [key](GPhotoConfigInfo.md#key)
- [label](GPhotoConfigInfo.md#label)
- [max](GPhotoConfigInfo.md#max)
- [min](GPhotoConfigInfo.md#min)
- [readonly](GPhotoConfigInfo.md#readonly)
- [step](GPhotoConfigInfo.md#step)
- [type](GPhotoConfigInfo.md#type)

## Properties

### choices

 `Optional` **choices**: `string`[]

___

### help

 `Optional` **help**: `string`

Some configs provide help text

___

### key

 **key**: `string`

___

### label

 **label**: `string`

___

### max

 `Optional` **max**: `number`

Only for RANGE

___

### min

 `Optional` **min**: `number`

Only for RANGE

___

### readonly

 **readonly**: `boolean`

___

### step

 `Optional` **step**: `number`

Only for RANGE

___

### type

 **type**: [`GPhotoConfigType`](../API.md#gphotoconfigtype)
