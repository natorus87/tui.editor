# Changelog

## 3.2.11 (2026-01-08)

### 🎨 Visual & UI Refinements
- **Color Syntax & Dark Mode**:
    -   **FIXED**: Text color is now correctly preserved and visible in WYSIWYG mode (Dark Mode). Resolved an issue where sanitizer was stripping `style` attributes.
    -   **NEW**: Added "Clear" button to the Color Picker to remove text color.
- **Internationalization (i18n)**:
    -   **NEW**: Added full multilingual support (23 languages) to `emoji`, `text-align`, and `details` plugins.
    -   **FIXED**: Resolved a crash in the demo page caused by missing 'Clear' translation keys in `en-US` and `de-DE`.
- **New Plugin (`text-align-simpel`)**:
    -   **NEW**: Released `@licium/editor-plugin-text-align-simpel`, a simplified alignment plugin supporting only Left and Center alignment.
- **Toolbar Layout Strategy**: Switched from `space-between` to `flex-start` (left-aligned) with fixed gaps (`15px`) to prevent dynamic jumping.
    -   Used CSS `:has()` selector to force the 'Scroll' toggle group to the far right.
- **Icon Updates (Final Polish)**:
    -   **CodeBlock**: New "Document with Brackets" design.
    -   **Text Color**: Simplified "Underlined A" design.
    -   **Visibility Fixes**: Resolved visibility issues for Italic and UL icons in Light Mode.
    -   **Dark Mode Consistency**:
        -   **Emoji**: Added white stroke version for dark mode.
        -   **Strike & Task List**: Updated to new geometric designs (White Stroke) in Dark Mode.
        -   **Table**: Updated to white filled/outline version in Dark Mode.
    -   **Table Icon**: New "Outline with Header Row" design (Header + Grid) for better clarity.

### 🖇️ Plugin Improvements
- **Details Plugin**:
    -   Fixed `Enter` key behavior (now correctly creates single new lines inside the block).
    -   Address nested content serialization data loss issues.
    -   Address nested content serialization data loss issues.
    -   Relocated "Collapsible Block" toolbar button to the "CodeBlock" group.
- **Text Align Plugin**:
    -   Relocated buttons to the **Line / Blockquote** group for improved toolbar organization.
- **Emoji Plugin**:
    -   Added new emoji picker with scrollable grid and functional emoji priorities.

## 3.2.8 (2025-01-03)

### 🎨 Visual & UI Refinements
- **Dark Mode Modernization**:
  - Unified toolbar background color (`#1f2937`) to match application header.
  - Refined button borders and states for better contrast in dark mode.
  - Updated color picker and popup styles to seamless dark theme.
- **Icon Overhaul**:
  - Replaced legacy sprite icons with high-resolution SVGs.
  - Unified icon aesthetic (stroked, geometric style) across Light and Dark modes.
  - **Fixed Icons**:
    - "Strike": New geometric 'S' shape.
    - "Ordered List": Fixed rendering issues with path based SVG.
    - "Text Color": New Serif-A icon with underline (fixed plugin override issues).
    - "Code Block": New File-based icon (removed legacy "CB" text).
- **Toolbar Layout**:
  - Applied `justify-content: space-between` for balanced distribution of toolbar groups.
  - Reduced outer padding (`10px`) and button margins (`3px`) for a compact, professional look.
  - Fixed scroll-sync toggle alignment.

### 🔌 Plugins
- **Text Align Plugin**: Added support for Left, Center, and Right text alignment.
- **Color Syntax**: Fixed icon integration to respect theme.
- **Code Syntax Highlight**: Verified integration and icon consistency.

### 📦 Rebranding
- Renamed all packages to `@licium` scope.
