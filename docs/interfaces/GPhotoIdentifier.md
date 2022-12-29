[gphoto](../API.md) / GPhotoIdentifier

# Interface: GPhotoIdentifier

Used to identify/specify a camera. Useful if there are multiple cameras connected.

From the gphoto2 docs:
> if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.

## Table of contents

### Properties

- [model](GPhotoIdentifier.md#model)
- [port](GPhotoIdentifier.md#port)
- [serial](GPhotoIdentifier.md#serial)

## Properties

### model

 `Optional` **model**: `string`

From the gphoto2 docs:
> if you specify ```model```, you must also specify ```port```. Otherwise the ```model``` option will be silently ignored.

___

### port

 `Optional` **port**: `string`

The ```port``` value of the camera.

___

### serial

 `Optional` **serial**: `string`

The serial number of the camera. Unique to each camera.
Only present when using `autoDetectWithSerials()`.
