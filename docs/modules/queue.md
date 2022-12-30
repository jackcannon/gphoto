[gphoto](../API.md) / queue

# Namespace: queue

Controls for the queuing functionality of the library.

## Table of contents

### Functions

- [disable](queue.md#disable)
- [disableLiveviewManagement](queue.md#disableliveviewmanagement)
- [enable](queue.md#enable)
- [enableLiveviewManagement](queue.md#enableliveviewmanagement)
- [isLiveviewManagementEnabled](queue.md#isliveviewmanagementenabled)
- [isQueueEnabled](queue.md#isqueueenabled)
- [setPauseTime](queue.md#setpausetime)

## Functions

### disable

**disable**(): `void`

Disable the queuing functionality. It is enabled by default.

#### Returns

`void`

___

### disableLiveviewManagement

**disableLiveviewManagement**(): `void`

Disable the management of liveview streams.

This stops the liveview stream before a command is executed and starts it again after the command is executed.

This is enabled by default.

#### Returns

`void`

___

### enable

**enable**(): `void`

Enable the queuing functionality. This is enabled by default.

#### Returns

`void`

___

### enableLiveviewManagement

**enableLiveviewManagement**(): `void`

Enable the management of liveview streams.

This stops the liveview stream before a command is executed and starts it again after the command is executed.

This is enabled by default.

#### Returns

`void`

___

### isLiveviewManagementEnabled

**isLiveviewManagementEnabled**(): `boolean`

Whether the management of liveview streams is enabled.

This stops the liveview stream before a command is executed and starts it again after the command is executed.

#### Returns

`boolean`

___

### isQueueEnabled

**isQueueEnabled**(): `boolean`

Whether the queuing functionality is enabled.

#### Returns

`boolean`

___

### setPauseTime

**setPauseTime**(`pauseTime`): `void`

Change the pause time between queued commands.

Time in milliseconds.

Default is `100`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pauseTime` | `number` |

#### Returns

`void`
