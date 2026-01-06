# Changelog

## [1.0.7] - 2026-01-04

### Fixed
- Fixed critical bug in Markdown serialization where `details` content was rendered outside the block. `toMarkdownRenderers` now correctly returns an array of opening and closing tags, ensuring children are wrapped properly.

## [1.0.8] - 2026-01-04

### Fixed
- Fixed Markdown-to-WYSIWYG conversion issue where split `<details>` blocks (caused by blank lines) resulted in content loss. Implemented a robust `markdownPlugins` AST transformer to group split nodes into a single `details` node before parsing. This ensures nested content is correctly preserved.

## [1.0.9] - 2026-01-04

### Fixed
- Fixed runtime crash (`Cannot read properties of undefined (reading 'state')`) caused by missing `details` node type in default schema. Added safe fallback to `htmlBlock` and registered explicit `toHTMLRenderers` for the custom `details` AST node.

## [1.0.11] - 2026-01-04

### Fixed
- Cleaned up incomplete revert in v1.0.10. Definitively removed `markdownPlugins` and `markdownParsers` from `index.ts`. This ensures no Remark plugins are passed to `MdEditor` (which expects ProseMirror plugins), resolving the crash once and for all.

## [1.0.12] - 2026-01-04

### Added
- **Native Editable Blocks**: Updated plugin to leverage new Core Schema (`details` and `summary` nodes). This enables full WYSIWYG editing (nested paragraphs, lists, etc.) without hacks.
- Requires custom build of `@toast-ui/editor` with `details` node support.

## [1.0.10] - 2026-01-04

### Reverted
- Reverted AST Transformation (`markdownPlugins`) and Custom Parsing (`markdownParsers`) to resolve critical runtime crash in `MdEditor`. The crash was due to `MdEditor` treating Remark plugins as ProseMirror plugins. `details` block support is reverted to atomic `htmlBlock` behavior temporarily while a core-compatible solution is developed.

## [1.0.6] - 2026-01-04

### Fixed
- Fixed content loss when switching from Markdown to WYSIWYG mode. Now uses a custom Markdown parser to correctly convert the `<details>` HTML block into component nodes (`details`, `summary`, `paragraph`) instead of an opaque HTML block.

## [1.0.5] - 2026-01-04

### Fixed
- Fixed the click toggle logic in WYSIWYG mode. The `open` attribute is now correctly recognized when it is an empty string, allowing the details block to open and close reliably.

## [1.0.4] - 2026-01-04

### Fixed
- Fixed a crash when switching to Markdown mode caused by the `open` attribute being treated as a boolean. Now correctly serialized as a string or presence-only attribute.

## [1.0.3] - 2026-01-04

### Added
- Added background color and border styling to the details block to distinguish it from surrounding content.
- Supports distinct styles for Light/Dark modes.

## [1.0.2] - 2026-01-03

### Fixed
- Improved exit logic to use `>=` comparison instead of strict equality, making it more reliable
- Simplified keydown event handling for better compatibility

## [1.0.1] - 2026-01-03

### Fixed
- Fixed an issue where the cursor would get trapped inside the `<details>` block in WYSIWYG mode.
- Users can now exit the block by pressing `Enter` on an empty paragraph or `ArrowDown` at the end of the content.

## [1.0.0] - 2026-01-02

### Added
- Initial release of the Details Block plugin (`@licium/editor-plugin-details`).
- Support for Markdown `<details>` and `<summary>` syntax.
- WYSIWYG support with collapsible/expandable behavior.
