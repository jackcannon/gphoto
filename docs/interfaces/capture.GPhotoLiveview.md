[gphoto](../API.md) / [capture](../modules/capture.md) / GPhotoLiveview

# Interface: GPhotoLiveview

[capture](../modules/capture.md).GPhotoLiveview

A liveview stream with methods for starting and stopping the stream.

## Table of contents

### Properties

- [isRunning](capture.GPhotoLiveview.md#isrunning)
- [start](capture.GPhotoLiveview.md#start)
- [stop](capture.GPhotoLiveview.md#stop)

## Properties

### isRunning

 **isRunning**: () => `boolean`

#### Type declaration

(): `boolean`

Whether the stream is currently running.

##### Returns

`boolean`

___

### start

 **start**: () => `Promise`<`void`\>

#### Type declaration

(): `Promise`<`void`\>

Start the liveview stream.

Not needed if `autoStart` is `true`.

##### Returns

`Promise`<`void`\>

___

### stop

 **stop**: () => `Promise`<`void`\>

#### Type declaration

(): `Promise`<`void`\>

Stop the stream

##### Returns

`Promise`<`void`\>
