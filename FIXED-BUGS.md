# Fixed Bugs & Improvements (Jan 2026)

## 🎨 UI/UX Improvements
- **Toolbar Layout**: Fixed dynamic spacing issues. Icons are now packed to the left with consistent gaps, and the 'Scroll' toggle is correctly pushed to the far right using CSS `:has()` selector.
- **Details Plugin**:
    -   Moved the "Collapsible Block" button to the "CodeBlock" group for better logical organization.
    -   Fixed `Enter` key behavior to allow creating a single empty line inside the block.
    -   Fixed CSS loading for the plugin.
- **Icon Refinements**:
    -   **CodeBlock**: Updated to a "Document with Brackets" design.
    -   **Text Color**: Updated to a simplified "Underlined A" design.
    -   **Strike**: Centered the 'S' glyph.
    -   **Task List**: Made the checkbox square and aligned.
    -   **Visibility**: Fixed Italic and Unordered List icons visibility in light mode.

## 🐛 Bug Fixes
- **Data Loss**: Fixed content loss when switching from WYSIWYG to Markdown and back, specifically for nested content in Details blocks.
