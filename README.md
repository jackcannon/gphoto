# gphoto

A simple node.js exec wrapper for [gphoto2](http://www.gphoto.org/)

- [gphoto](#gphoto)
  - [Install](#install)
    - [Prerequisites](#prerequisites)
      - [Homebrew](#homebrew)
      - [APT](#apt)
    - [Add gphoto to project](#add-gphoto-to-project)
  - [Queue](#queue)
  - [Examples](#examples)
  - [API](#api)

## Install

### Prerequisites

You should have libgphoto2 and gphoto2 installed.

#### Homebrew

```bash
brew install libgphoto2
brew install gphoto2
gphoto2 --auto-detect
```

#### APT

```bash
sudo apt install libgphoto2-6
sudo apt-get install gphoto2
gphoto2 --auto-detect
```

> Note: You may need admin rights to access/control cameras on your machine.

### Add gphoto to project

```bash
npm install gphoto
```

or

```bash
yarn add gphoto
```

## Queue

This library utilises a queue manager that waits until other operations have finished before beginning a new one. This is intended to prevent i/o conflicts with gphoto2 attempting several operations on the same camera at the same time.

Queues are identifier specific, so it's possible to use multiple cameras (using different GPhotoIdentifier values) without them colliding.

The queue manager also adds a short 100 millisecond pause after each operation has finished. This can be changed by calling `gPhoto.queue.setPauseTime(x)` with the desired pause time. Set to `-1` for no pause.

The queue functionality can be disabled by calling `gPhoto.queue.disable()`. This disables all queuing, and pauses.

API for queue can be found [in the documentation](docs/modules/queue.md).

## Examples

A selection of short examples can be found in examples/examples.ts

They can be run using the `yarn example [NAME]` command.

Run `yarn example help` to see a list of available examples that can be run.

## API

Full TypeDoc API documents can be [found here](docs/API.md)
