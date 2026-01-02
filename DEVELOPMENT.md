# Development Guide

This document serves as a comprehensive guide to understanding, developing, and contributing to the `tui.editor` repository. It covers the project structure, build system, core architecture, and testing procedures.

## Project Overview

`tui.editor` is a monorepo managed with [Lerna](https://lerna.js.org/) that houses the TOAST UI Editor, its wrappers (React, Vue), and associated libraries and plugins.

### Repository Structure

- **`apps/`**: Contains the main applications and wrappers.
    - **`apps/editor`**: The core Vanilla JS editor implementation. This is the heart of the project.
    - **`apps/react-editor`**: React wrapper for the editor.
    - **`apps/vue-editor`**: Vue wrapper for the editor.
- **`libs/`**: Shared libraries.
    - **`libs/toastmark`**: A GFM (GitHub Flavored Markdown) Markdown parser and AST manager used by the editor for Markdown mode and syntax highlighting.
- **`plugins/`**: Official plugins for the editor.
    - `chart`, `code-syntax-highlight`, `color-syntax`, `table-merged-cell`, `uml`, etc.
- **`scripts/`**: Build and maintenance scripts.

## Build System

The project uses a combination of **Lerna** for package management and **npm scripts** for task execution.

### Key Commands

Run these commands from the root directory:

- **`npm install`**: Boostraps the project (installs dependencies for root and all packages via Lerna).
- **`npm run build`**: Builds all packages.
    - Internally runs `lerna run --stream build`.
    - `apps/editor` uses Webpack and Rollup for bundling. wrappers use Rollup.
- **`npm run test`**: Runs unit tests using Jest.
- **`npm run lint`**: Runs ESLint across the codebase.
- **`npm run serve`**: Starts the development server (Snowpack or Webpack Dev Server).

### Apps Configuration (`apps/editor`)

The core editor uses a sophisticated build setup:
- **Webpack**: Used for development server (`npm run serve`) and production builds.
- **Rollup**: Used for generating ESM builds.
- **Snowpack**: Used for fast development server.

## Core Architecture

### `apps/editor`

The core editor is built around a class-based architecture that manages two main editing modes: **wysiwyg** and **markdown**.

- **`ToastUIEditor` (src/editor.ts)**: The main entry point. It extends `EditorCore` and initializes the UI layout.
- **`EditorCore` (src/editorCore.ts)**: Manages the underlying state, event system (`EventManager`), and the switch between Markdown and WYSIWYG modes.
- **`ProseMirror`**: The editor heavily relies on ProseMirror for its WYSIWYG engine and Markdown editing experience.
- **Virtual DOM**: A custom light-weight virtual DOM implementation (`src/ui/vdom`) is used for rendering the Editor's UI (Toolbar, Popup, etc.).

### `libs/toastmark`

The `toastmark` library is a critical component that parses Markdown text into an AST (Abstract Syntax Tree). This AST is used to:
1.  Provide syntax highlighting in the Markdown editor.
2.  Maintain a mapping between the Markdown text and the Preview preview (synchronous scrolling).

### Wrappers (React/Vue)

The wrappers (`apps/react-editor`, `apps/vue-editor`) are thin layers that:
1.  Initialize the vanilla `ToastUIEditor` instance via a `ref`.
2.  Bind React/Vue props to Editor options.
3.  Expose event handlers as component props.

## Plugins

Plugins are separate packages that extend the editor's functionality. They usually export a function that accepts the `editor` instance and registers:
-   **Markdown renderers**: For custom syntax (e.g., charts, UML).
-   **HTML renderers**: For previewing custom syntax.
-   **Toolbar items**: To add UI controls.

## Testing

- **Unit Tests**: written in Jest. Located in `__test__` directories or alongside source files.
- **Visual/E2E**: The setup implies some E2E testing capabilities, likely ensuring the editor renders correctly across browsers (IE support is noted in scripts).

## detailed File Analysis

### `root/package.json`
-   Defines the workspace structure.
-   Centralizes devDependencies like `babel`, `webpack`, `typescript`, `jest`, `eslint`.

### `apps/editor/src/index.ts`
-   Exports the `Editor` class and stylesheet imports.
-   Serves as the main bundle entry point.

### `apps/editor/src/editor.ts`
-   Implements `ToastUIEditor`.
-   Sets up the `Layout` component which contains the Toolbar and Editor area.
-   Manages the plugin interactions via `defaultUI`.

## Reproduction Environment (Docker)

A Docker-based reproduction environment helps in isolating bugs.

### Setup
1.  **Build Locally**: The editor must be built locally first.
    ```bash
    export NODE_OPTIONS=--openssl-legacy-provider
    npm install --legacy-peer-deps
    # Run full build to generate UMD bundles (apps/editor/dist/cdn/toastui-editor-all.js)
    npx lerna run build --scope=@toast-ui/editor --include-dependencies
    ```
2.  **Run Docker**:
    ```bash
    docker build -t tui-editor-repro -f development/Dockerfile .
    docker run -d -p 8080:8080 --name tui-repro tui-editor-repro
    ```
3.  **Access**: Open [http://localhost:8080/development/index.html](http://localhost:8080/development/index.html).

### Architecture
-   **Static Serving**: The Docker container simply serves the project root using `http-server`.
-   **UMD Usage**: The reproduction harness (`development/index.html`) uses the robust UMD bundle (`dist/cdn/toastui-editor-all.js`).
-   **Dependencies**: All dependencies (ProseMirror, etc.) are bundled, avoiding Import Map complexity and version mismatches.
-   **CSS**: Uses the bundled CSS from `dist/cdn`.

## Troubleshooting & Lessons Learned

### Node.js Compatibility
-   **Issue**: Builds fail on Node.js 17+ due to OpenSSL 3 changes (Webpack 4 compatibility).
-   **Fix**: Use `export NODE_OPTIONS=--openssl-legacy-provider` before running build commands.
-   **Recommended Version**: Node.js 16 is the original target, but Node 20 works with the legacy provider flag.

### ESM vs UMD
-   **Issue**: The ESM build (`dist/esm`) targets ES5 (classes as functions) but modern CDN dependencies (esm.sh) provide native ES6 classes. This causes `Class constructor cannot be invoked without 'new'` errors.
-   **Fix**: Use the **UMD bundle** (`dist/cdn/toastui-editor-all.js`) for reproduction environments. It bundles all dependencies internally, preventing version/target mismatches.
-   **Alternative**: If ESM is strictly required, ensure `tsconfig.json` targets `ES2015` or higher locally, or use a bundler that handles the transpilation.

### Common Pitfalls & Best Practices
-   **Public API Inputs**: public methods like `setMarkdown` should valid inputs (e.g. check for null/undefined) to prevent crashes.
-   **Convertor Safety**: Conversions between Markdown and WYSIWYG (`toWysiwygModel`, `toMarkdownText`) can return `null` if the input is invalid. Always check for existence before using the result.
    -   *Example*: Fixed in #2172 where `getHTML()` crashed because `toWysiwygModel` returned null.


