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

### Running the "All Plugins" Demo

The `demo-all.html` file provides a comprehensive environment to test the editor with all official plugins enabled.

#### Prerequisites
1.  **Build the Project**: You must build the project to generate the CDN artifacts used by the demo.
    ```bash
    npm run build:all
    ```
    *Note: `npm run build:cdn` may not exist or be sufficient in all environments. `build:all` ensures `toastui-editor-all.js` and all plugin bundles are up-to-date.*

2.  **Serve Locally**:
    Start a simple HTTP server in the root directory.
    ```bash
    python3 -m http.server 8080
    ```

3.  **Access**:
    Open [http://localhost:8080/demo-all.html](http://localhost:8080/demo-all.html).

#### Common Issues
-   **Missing Translations (i18n)**:
    If utilizing a non-English locale (e.g., `de-DE`), ensure the corresponding language file is explicitly loaded in `demo-all.html` **after** the main editor script.
    ```html
    <script src="./apps/editor/dist/cdn/toastui-editor-all.js"></script>
    <!-- Explicitly load the locale file if the bundle is missing keys -->
    <script src="./apps/editor/dist/cdn/i18n/de-de.js"></script>
    ```
    *Reason*: The main bundle (`toastui-editor-all.js`) might lag behind the specific language files during development, leading to missing keys (e.g., `"Clear"` button in Color Syntax).


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



## Release Process

### Authentication
To publish packages to the `@licium` scope, you need an NPM token with **Read and Publish** permissions.

1.  Generate a **Classic Token** on npmjs.com (Type: **Automation** recommended to bypass 2FA prompts during CI/automated scripts).
2.  Create or update the `.npmrc` file in the project root:
    ```ini
    //registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN
    ```
3.  Verify your login:
    ```bash
    npm whoami
    # Should output 'natorus87' (or the account owner of the scope)
    ```

### Publishing Steps
We use `lerna` to manage multi-package releases.

1.  **Ensure Clean State**: Make sure all changes are committed.
2.  **Build**: Ensure everything is built (usually handled by pre-publish scripts, but good to verify).
3.  **Publish**:
    ```bash
    ./node_modules/.bin/lerna publish from-package --yes
    ```
    -   `from-package`: Compares the version in `package.json` with the registry. If local > registry, it publishes. This is robust for retries.
    -   `--yes`: Skips confirmation prompts.

### Troubleshooting
-   **"Access token expired or revoked"**:
    -   Verify your token in `.npmrc`.
    -   Ensure it is a **Classic Token**. Granular Access Tokens sometimes have scope issues with Lerna/CLI.
    -   Run `npm whoami` to confirm the token is picked up.
    -   Check if a global `.npmrc` (`~/.npmrc`) conflicts with the local one.
-   **Partial Failures**:
    -   If Lerna fails midway (e.g., E404 for some packages), you can manually publish the failed packages:
        ```bash
        cd packages/failed-package
        npm publish --access public
        ```
    -   Then re-run `lerna publish from-package` to ensure consistency.

### Plugin Development Patterns

#### Bypassing Schema Stripping in WYSIWYG
-   **Problem**: The WYSIWYG editor (ProseMirror) strictly adheres to the schema. Custom attributes (like `align`) on standard blocks (like `p` or `div`) are often stripped during conversion or pasting if the schema doesn't explicitly allow them.
-   **Solution (Mark Strategy)**: Instead of trying to modify block attributes or register new block nodes (which is complex), use **Marks** (like `<span>`).
    -   Register a `span` mark with attributes (e.g., `style`).
    -   Apply `display: block` style to the span to make it behave visually like a block wrapper.
    -   This is supported by the default `htmlInline` renderer and bypasses block-level schema restrictions.
    -   *Example*: Text Alignment plugin uses `<span style="display: block; text-align: center">...</span>`.

#### ProseMirror Plugin Architecture
-   **Factory Functions**: When injecting ProseMirror plugins via `wysiwygPlugins`, you MUST provide an **array of factory functions**, not plugin instances.
    -   *Bad*: `wysiwygPlugins: [new Plugin({...})]` -> Causes `TypeError: plugin is not a function`.
    -   *Good*: `wysiwygPlugins: [() => new Plugin({...})]`.
-   **Bundling & Classes**: If your plugin uses `prosemirror-state`'s `Plugin` class, ensure it is correctly imported or bundled.
    -   In some Webpack setups, the `Plugin` class might be undefined at runtime if not handled carefully.
    -   *Pattern*: Inline the factory and add a safety check: `if (typeof Plugin === 'undefined') return {};` or ensure `prosemirror-state` is provided via `externals` or bundled dependencies.

#### Markdown Command Parsing
-   **Robustness**: When implementing toggle logic in Markdown commands, use loose **Regex** to detect existing wrapping tags.
-   **Reason**: Attributes order or whitespace might vary. strict string matching will fail often.
    -   *Bad*: `text === '<div align="center">...</div>'`
    -   *Good*: `text.match(/^\s*<span\s+[^>]*style="[^"]*text-align:\s*(center)...`


#### UI & Icon Strategy
-   **Toolbar Icons**: Avoid using external image files (PNG/JPG) which need complex build config.
-   **Best Practice**: Use **Base64 encoded SVGs** embedded directly in CSS.
    -   *Advantages*: No extra network requests, no webpack asset configuration needed, sharp scaling.
    -   *Implementation*: Set `background-image` in CSS.
-   **Sizing**: Standard toolbar buttons are **32x32px**.
    -   If your icon sprite has different spacing, use `background-position` to center it (e.g., if icons are 24px, offset by 4px).
-   **Dark Mode**: The editor adds the class `.toastui-editor-dark` to the container.
    -   Override the `background-image` in your CSS for this selector to provide white/light icons.
    -   *Pattern*:
        ```css
        .toastui-editor-toolbar-icons.my-plugin { background-image: url('data:image/svg+xml;base64,...'); }
        .toastui-editor-dark .toastui-editor-toolbar-icons.my-plugin { background-image: url('data:image/svg+xml;base64,...(white version)...'); }
        ```

#### CSS Strategy: Custom Icons
- **Goal**: Replace default icons with custom designs without altering the build process.
- **Solution**: Use high-specificity CSS selectors and `background-image` with base64-encoded SVGs.
    -   Ensure `background-size: 24px 24px` and `background-position: center`.
    -   Use `!important` if necessary to override default sprite positioning.

#### CSS Strategy: Parent Selection
- **Problem**: Need to style a parent container based on a specific child (e.g., right-aligning a toolbar group that contains the Scroll toggle).
- **Solution**: Use the `:has()` pseudo-class.
    -   *Example*: `.toastui-editor-toolbar-group:has(.scroll-sync) { margin-left: auto; }`
    -   This is supported in all modern browsers and allows for robust layout control without JavaScript.

## Verified Plugin Status (Jan 2026)

Verified against `demo-all.html` (served via http-server).

| Plugin | Status | Notes |
| :--- | :--- | :--- |
| **Details** | **PASS** | Core logic, interactions (Enter key), and CSS fixed. Toolbar button moved to CodeBlock group. |
| **Chart** | **FAILED** | Fails to render in demo. `$$chart` syntax untested but initial attempts failed. Needs `usageStatistics: false`. |
| **UML** | **FAILED** | Fails to render. Needs HTTPS renderer URL. `$$uml` syntax untested. |
| **Color Syntax** | **PARTIAL** | Color text rendering works. Color picker UI needs verification. |
| **Table Merged Cell** | **PASS** | Works correctly. |
| **Code Syntax Highlight**| **PASS** | Works correctly with Prism. |
| **Text Align** | **PASS** | Works correctly. Buttons relocated to Line/Quote group. |
| **Emoji** | **PASS** | Works correctly. Dark mode supported. |
| **Highlight** | **PASS** | Refactored to use `tui-color-picker` and inline styles. |

### Pending Fixes
- **Chart/UML**: Investigate `$$` syntax support vs ``` code block support.

## CDN Build Note
When working on plugins that are used in `demo-all.html` (which loads from `dist/cdn`), you must run the CDN build script to propagate changes:
```bash
npm run build:cdn
```
Or use the combined build script if available:
```bash
npm run build
```
(Check `package.json` scripts for specifics as some plugins separate these).

## CDN Build Note
When working on plugins that are used in `demo-all.html` (which loads from `dist/cdn`), you must run the CDN build script to propagate changes:
```bash
npm run build:cdn
```
Or use the combined build script if available:
```bash
npm run build
```
(Check `package.json` scripts for specifics as some plugins separate these).

## Recent Technical Fixes (Jan 2026)

### Color Syntax Plugin - Dark Mode Visibility
- **Issue**: Text color applied via the Color Syntax plugin was not visible in WYSIWYG mode (especially in Dark Mode) because the `style` attribute was being stripped from the `span` tags during rendering.
- **Root Cause**: The `toDOM` function for `htmlInline` marks (in `apps/editor/src/wysiwyg/nodes/html.ts`) was calling `sanitizeDOM`, which internally used `DOMPurify`. Even with `style` allowed, the sanitization process on `outerHTML` was removing the attribute in the editor's specific context.
- **Fix**: Modified `htmlInline.toDOM` to bypass `sanitizeDOM` and directly use `node.attrs.htmlAttrs` from the ProseMirror node. This ensures that valid attributes stored in the document model are rendered to the DOM without interference.
- **Feature**: Added a "Clear" button to the Color Picker UI to easily remove color formatting.

### Highlight Plugin - Refactor
- **Change**: Moved from CSS classes (`.hl-color`) to inline styles (`background-color: ...`).
- **Reason**: Allows for arbitrary color selection via the Color Picker, removing the limitation of pre-defined palettes.
- **Tech**: Reused `tui-color-picker` integration from the Color Syntax plugin for UI consistency.

### Color Syntax Plugin - UX Improvements
- **Layout Fix**: Resolved issue where "OK" and "Clear" (Zurücksetzen) buttons overlapped in languages with longer labels (e.g., German). Removed absolute positioning and implemented a flexbox container.
- **Scroll Just Fix**: Fixed a bug where confirming a color selection cause the editor to scroll to the top unexpectedly. Implemented `{ preventScroll: true }` on focus restoration.


### Plugin Internationalization (i18n)
- **Improvement**: Implemented comprehensive i18n support for `emoji`, `text-align`, and `details` plugins.
- **Coverage**: All 23 languages supported by the core editor (e.g., `de-DE`, `es-ES`, `ja-JP`) are now available in these plugins.
- **Key Fix**: Added missing 'Clear'/'Zurücksetzen' keys to `en-us.ts` and `de-de.ts` to prevent editor initialization crashes when using the `color-syntax` plugin in those locales.

### New Plugins
- **Text Align Simpel**: Created `@licium/editor-plugin-text-align-simpel`.
    - **Purpose**: A simplified version of `text-align` that supports only **Left** and **Center** alignment (no Right align).
    - **Usage**: Drop-in addition or replacement for the standard `text-align` plugin.
