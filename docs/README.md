gphoto / [Exports](modules.md)

# gphoto

A simple node.js exec wrapper for [gphoto2](http://www.gphoto.org/)

- [gphoto](#gphoto)
  - [Install](#install)
    - [Prerequisites](#prerequisites)
      - [Homebrew](#homebrew)
      - [APT](#apt)
    - [Add gphoto to project](#add-gphoto-to-project)
  - [API](#api)
    - [gphoto.autoDetect](#gphotoautodetect)

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

## API

A collection of user input functions that use the `prompts` library

### gphoto.autoDetect

TODO - write docs

```typescript
// example here
```

[↑ Back to top ↑](#gphoto)
