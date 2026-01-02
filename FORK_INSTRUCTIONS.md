# Fork Usage and Release Instructions

## 1. Building the Project
To use the changes locally, you first need to build all packages in the monorepo.

```bash
# Install dependencies
npm install

# Build all workspace packages (editor, plugins, wrappers)
npm run build:all
```

After building, the artifacts will be available in the `dist` folder of each package (e.g., `apps/editor/dist`).

### Publishing
The project is configured with the scope **`@licium`**.

#### 1. Login & Publish
To publish these packages to NPM under the `@licium` organization (or if you change the scope again, your own):

1.  **Login**:
    ```bash
    npm login
    ```
2.  **Publish**:
    *Note: Scoped packages are private by default. To publish them publicly (free), add `--access public` or ensure your lerna config sets it.*
    ```bash
    npx lerna publish from-package -- --access public
    ```

#### Changing Scope (Optional)
If you want to use a different scope (e.g., `@your-username`), you can replace `@licium` with your desired scope globally in the project using your editor's "Find and Replace in Files" feature.
- **Find**: `@licium/`
- **Replace**: `@your-scope/`

## 3. Using Locally (Without Publishing)
If you want to use this build in another local project without publishing to npm:

1.  Run `npm run build:all`
2.  In your target project, install from the local path:
    ```bash
    npm install /path/to/tui.editor/apps/editor
    ```
    (Repeat for plugins/wrappers as needed)
