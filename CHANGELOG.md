# Changelog

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
