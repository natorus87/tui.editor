> This is a fork of the [Toast UI Editor](https://github.com/natorus87/tui.editor) maintained by `@licium`.
> Original repository: https://github.com/natorus87/tui.editor

# TOAST UI Editor : Table Merged Cell Plugin

> This is a plugin of [TOAST UI Editor](https://github.com/natorus87/tui.editor/tree/master/apps/editor) to merge table columns.

[![npm version](https://img.shields.io/npm/v/@licium/editor-plugin-table-merged-cell.svg)](https://www.npmjs.com/package/@licium/editor-plugin-table-merged-cell)

![table-merged-cell](https://user-images.githubusercontent.com/37766175/121814008-c0232480-cca9-11eb-8611-7ccc0fe8707f.png)

## 🚩 Table of Contents

- [Bundle File Structure](#-bundle-file-structure)
- [Usage npm](#-usage-npm)
- [Usage CDN](#-usage-cdn)

## 📁 Bundle File Structure

### Files Distributed on npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-table-merged-cell/
      - dist/
        - toastui-editor-plugin-table-merged-cell.js
        - toastui-editor-plugin-table-merged-cell.css
```

### Files Distributed on CDN

The bundle files include all dependencies of this plugin.

```
- uicdn.toast.com/
  - editor-plugin-table-merged-cell/
    - latest/
      - toastui-editor-plugin-table-merged-cell.js
      - toastui-editor-plugin-table-merged-cell.min.js
      - toastui-editor-plugin-table-merged-cell.css
      - toastui-editor-plugin-table-merged-cell.min.css
```

## 📦 Usage npm

To use the plugin, [`@licium/editor`](https://github.com/natorus87/tui.editor/tree/master/apps/editor) must be installed.

> Ref. [Getting Started](https://github.com/natorus87/tui.editor/blob/master/docs/en/getting-started.md)

### Install

```sh
$ npm install @licium/editor-plugin-table-merged-cell
```

### Import Plugin

#### ES Modules

```js
import '@licium/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css';

import tableMergedCell from '@licium/editor-plugin-table-merged-cell';
```

#### CommonJS

```js
require('@licium/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css');

const tableMergedCell = require('@licium/editor-plugin-table-merged-cell');
```

### Create Instance

#### Basic

```js
import '@licium/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css';

import Editor from '@licium/editor';
import tableMergedCell from '@licium/editor-plugin-table-merged-cell';

const editor = new Editor({
  // ...
  plugins: [tableMergedCell]
});
```

#### With Viewer

```js
import '@licium/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css';

import Viewer from '@licium/editor/dist/toastui-editor-viewer';
import tableMergedCell from '@licium/editor-plugin-table-merged-cell';

const viewer = new Viewer({
  // ...
  plugins: [tableMergedCell]
});
```

or

```js
import '@licium/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css';

import Editor from '@licium/editor';
import tableMergedCell from '@licium/editor-plugin-table-merged-cell';

const viewer = Editor.factory({
  // ...
  plugins: [tableMergedCell],
  viewer: true
});
```

## 🗂 Usage CDN

To use the plugin, the CDN files(CSS, Script) of `@licium/editor` must be included.

### Include Files

```html
...
<head>
  ...
  <link
    rel="stylesheet"
    href="https://uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.css"
  />
  ...
</head>
<body>
  ...
  <!-- Editor -->
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <!-- Editor's Plugin -->
  <script src="https://uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.js"></script>
  ...
</body>
...
```

### Create Instance

#### Basic

```js
const { Editor } = toastui;
const { tableMergedCell } = Editor.plugin;

const editor = new Editor({
  // ...
  plugins: [tableMergedCell]
});
```

#### With Viewer

```js
const Viewer = toastui.Editor;
const { tableMergedCell } = Viewer.plugin;

const viewer = new Viewer({
  // ...
  plugins: [tableMergedCell]
});
```

or

```js
const { Editor } = toastui;
const { tableMergedCell } = Editor.plugin;

const viewer = Editor.factory({
  // ...
  plugins: [tableMergedCell],
  viewer: true
});
```
