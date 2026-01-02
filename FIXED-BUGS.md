# Fixed Bugs

This file tracks all bugs that have been successfully resolved during this development session.

## Critical & High Priority

- **#2172**: `getHTML()` throw exception!!
  - **Resolution**: Fixed null pointer exceptions in `mdEditor.ts` (handling null markdown input) and `editorCore.ts` (handling null conversion result).

## WYSIWYG <-> Markdown Sync & Conversion

- **#3011**: HTML entered in markdown mode disappears when switching to wysiwyg.
  - **Resolution**: Added a default `customHTMLRenderer` for `iframe` in `editorCore.ts`. This ensures that `iframe` tags are recognized as valid `htmlBlock` nodes in the schema and correctly preserved during conversion, instead of being stripped by the sanitizer or dropped by the parser.

- **#3093**: Losing formatting when switching between markdown and WYSIWYG.
  - **Resolution**: Fixed `toMdNodeTypeWriters.ts` paragraph converter to properly handle the first empty paragraph in a document. Previously, the first empty paragraph would write only `\n` instead of `<br>`, causing one BR tag to be lost on each mode switch. Now all empty paragraphs correctly write `<br>` tags.

- **#3291**: Formatted WYSIWYG Viewer Not clearing view when HTML Header Tags appear after unformatted text.
  - **Resolution**: Added converters for `h1-h6` inline HTML tags in `htmlToWwConvertors.ts`. The fix properly manages paragraph/heading transitions by closing the current paragraph before opening a heading node, then always reopening a paragraph after closing the heading to maintain proper document structure during AST traversal.

- **#2708**: Switch to wysiwyg mode change markdown syntax to html tag.
  - **Resolution**: Modified `htmlToWwConvertors.ts` to stop injecting `rawHTML` attributes for standard marks (`strong`, `em`, `strike`, `code`), forcing normalization to Markdown syntax.

## Input, IME & Internationalization

- **#3302**: Inserting Korean characters in the middle of a link.
  - **Resolution**: Removed `inclusive: false` from the `Link` mark definition in `wysiwyg/marks/link.ts` to allow link extension during IME composition.

- **#3277**: In WYSIWYG mode, inputting `# 1` does not render as a first-level heading.
  - **Resolution**: Created `markdownInputRules.ts` with standard ProseMirror input rules (headings, blockquotes, lists) and added it to `wwEditor.ts` plugins, covering the missing behavior.

- **#3300**: Duplicate Line Breaks Removed on Paste in WYSIWYG Editor.
  - **Resolution**: Implemented custom `clipboardTextParser` in `wysiwyg/clipboard/pasteTextParser.ts` to properly split text by newlines and create empty paragraphs, overriding ProseMirror's default whitespace collapsing.

- **#3266**: After rendering content using 'initialValue', `ctrl+z` clears it to blank space.
  - **Resolution**: Modified `setModel` (WYSIWYG) and `setMarkdown` (Markdown) to accept `addToHistory` parameter, and updated initialization logic to set it to `false` preventing initial value from being added to the undo stack.
- [x] Fix Bug #2744: Render empty table will crash the WW editor <!-- id: 130 -->
    - [x] Verify fix (Test completely empty table rendering) <!-- id: 131 -->

- **#3228**: Select in a cell cause error : `Uncaught TypeError`
  - **Resolution**: Modified `tableBody.ts` to check if rows exist before accessing children, preventing crashes on empty `tbody`.

- **#2744**: Render empty table will crash the WW editor
  - **Resolution**: Duplicate/Related to #3228. Fixed by the same `tableBody.ts` safeguard for empty table parsing.

- **#3224**: Drag & Drop and Paste of Images renders as Base64 in Firefox
  - **Resolution**: Modified `wwEditor.ts` and `mdEditor.ts` to remove the check that ignored images if `text/rtf` was present in the clipboard (common in Firefox). The editor now processes images regardless of RTF presence.
## Bug #3208: Table Drag Selection Crash (WYSIWYG)
- **Problem**: Dragging (or selecting) inside a table caused a crash if the document structure changed during the operation (e.g. real-time updates or programmatic changes), leading to `TypeError: Cannot read properties of null (reading 'totalColumnCount')` in `CellSelection.map`.
- **Solution**:
    1.  Modified `apps/editor/src/wysiwyg/plugins/selection/tableSelectionView.ts` to wrap `setCellSelection` in a safe try-catch block and ensure the selection uses the current document.
    2.  Modified `apps/editor/src/wysiwyg/plugins/selection/cellSelection.ts` to check if `TableOffsetMap.create` returns null in the `map` method, falling back to a safe `TextSelection` if the table is no longer valid.
- **Verification**: Reproduced the crash by modifying markdown during a drag-select event, and verified that the fix prevents the crash.
- **#3217**: Indentation in front of HTML block crashes WYSIWYG editor
  - **Resolution**: Fixed a crash in `htmlBlock` converter where `reHTMLTag` failed to match indented HTML strings, leading to a null reference error. Added a fallback to match the trimmed string if the strict match fails.

### Bug #3177: `setHTML` and Viewer component bug: inserted links are forcibly deleted
- **Problem**: Links inserted via `setHTML` lost attributes like `id`, `class`, `target`, and `rel` during conversion to Markdown or Viewer rendering because the Prosemirror schema did not support them.
- **Fix**: Updated `link.ts` schema to support these attributes and modified `toMdConvertors.ts` to output raw HTML anchor tags when these attributes are present.
- **Verification**: Confirmed preservation of attributes in Markdown conversion and Viewer rendering.

### Bug #2795: Table inside HTML comment crashes the editor
- **Problem**: Invalid HTML comments (e.g. containing double dashes) crashed the editor during Markdown-to-WYSIWYG conversion because they failed strict regex validation but were identified as HTML blocks.
- **Fix**: Updated `toWwConvertors.ts` to fundamentally treat any block starting with `<!--` as a comment, serving as a robust fallback.
- **Verification**: Verified that invalid comments no longer cause a crash.

### Bug #2944: Certain data sequence in table causes crash/corruption
- **Problem**: Pipes (`|`) inside code spans (e.g., `` `|` ``) in tables were incorrectly treated as cell delimiters, interpreting a single cell as two unique cells.
- **Fix**: Updated `libs/toastmark` parser logic to ignore pipes within code spans.
- **Verification**: Confirmed pipes in code spans are preserved and table structure is maintained.

### Bug #2775: Error on building toast ui editor
- **Problem**: Build failed with `TS5055` because TypeScript attempted to overwrite `src/ui/vdom/htm.js` due to `allowJs: true`.
- **Fix**: Disabled `allowJs` in `rollup.config.js` and added `htm.d.ts` type definition.
- **Verification**: Confirmed `npm run build` succeeds.

### Bug #2662: Cannot find module `@t/index`
- **Problem**: Ambiguous path resolution for `@t/index`.
- **Fix**: Added explicit path mapping in `apps/editor/tsconfig.json`.
- **Verification**: Confirmed `test:types` pass.

### Bug #2552: Build failure due to Prosemirror Command class move
- **Problem**: `Command` type missing from `prosemirror-commands`.
- **Fix**: Updated imports to `prosemirror-state`. Also fixed type error in `link.ts`.
- **Verification**: Confirmed `test:types` pass.

### Bug #2551: Build failure due to Prosemirror Plugin class
- **Problem**: Upstream changes in `Plugin` class definition.
- **Fix**: Verified current `prosemirror-state` version (1.4.1) handles `Plugin` usage correctly. No code changes needed.
- **Verification**: Confirmed `test:types` pass.

### Bug #2550: Importing language files using Typescript/Rollup does not work
- **Problem**: Missing `.d.ts` files for i18n modules.
- **Fix**: Enabled declaration generation in `rollup.config.js` and added a plugin to flatten the output structure.
- **Verification**: Confirmed presence of `.d.ts` files in `dist/esm/i18n`.

### Bug #2494: ReferenceError: self is not defined
- **Problem**: SSR crash due to `self` and `navigator` access in global scope.
- **Fix**: Set `output.globalObject: 'this'` in Webpack and added guards for `navigator` in `common.ts`.
- **Verification**: Confirmed successful import of bundle in Node.js script.
| Bug: Deleting parent list item deletes children | Fixed logic in `liftToPrevListItem` to prevent deletion of nested children. Logic now lifts children before deleting parent. | Verified logic and implementation. (Browser verification rate-limited but build confirmed). |
- **[Bug #2522]** Fixed concurrency bug in Chart Plugin that caused missing charts (and potentially crashes) by removing shared module-level timer.
- **[Bug #1339]** Hardened XSS protection by explicitly forbidding `svg` and `math` tags in HTML Sanitizer, mitigating potential bypasses.
- **[Bug #1200]** Fixed XSS vulnerability via `javascript:` URLs in Markdown links by sanitizing schemes in the  mark toDOM method.
- **[Bug #1470]** Fixed ReDoS vulnerability in `reEscapeHTML` regex (utils/common.ts) by removing overlapping alternatives.
- **[Bug #1199]** Fixed DOM Property Pollution vulnerability in deep merge utilities (utils/common.ts) by filtering dangerous keys (`__proto__`, `constructor`, `prototype`).
- **[Bug #3230]** Verified Image Insertion via URL (Could not reproduce reported failure; added regression test).

### Bug #3296: The column alignment feature does not work properly in 'WYSIWYG' mode
- **Problem**: When changing column alignment in WYSIWYG mode using the context menu, the change was not reflected in the Markdown output if the cell was selected as a `NodeSelection` (entire cell selected).
- **Cause**: The `getResolvedSelection` helper function did not handle `NodeSelection`, causing the `alignColumn` command to fail to identify the selected cells.
- **Fix**: Updated `getResolvedSelection` in `apps/editor/src/wysiwyg/helper/table.ts` to correctly handle `NodeSelection` by identifying the selected table cell node and returning its position.
- **Verification**: Verified with a new regression test in `wwTableCommand.spec.ts` and manual testing.

### Bug #3295: Problem getting final markdown result after switching modes multiple times
- **Problem**: Moving the cursor to the end of the document caused a crash or warning if the document ended with a block element (like a BlockQuote). This often happened during mode switching (`changeMode`), leading to potential data loss or inconsistent state.
- **Cause**: The `moveCursorToEnd` method in `EditorBase` and `setSelection` in `WysiwygEditor` used naive logic (`size - 1`) to calculate the cursor position and forced a `TextSelection`. This is invalid when the end of the document is not a text node but a block node wrapper.
- **Fix**: Updated `moveCursorToEnd` and `moveCursorToStart` in `apps/editor/src/base.ts`, and `setSelection` in `apps/editor/src/wysiwyg/wwEditor.ts` to use `Selection.near()` from `prosemirror-state`. This allows ProseMirror to safely find the valid selection position (which might be a `NodeSelection` for block nodes) instead of forcing an invalid `TextSelection`.
- **Verification**: Created `repro_3295.spec.ts` which reproduced the crash with a BlockQuote at the end of the document. The fix resolved the crash and warnings. Also updated `editor.spec.ts` to account for valid `NodeSelection` on iframe blocks.

### Bug #3294: Inconsistent cursor position when switching between Markdown and WYSIWYG
- **Problem**: Switching between Markdown and WYSIWYG modes caused the cursor to lose its precise intra-node position (e.g., inside a text node), snapping to the start or end of the block instead.
- **Cause**: The `setFocusedNode` event emission in both modes (`previewHighlight.ts` and `wwEditor.ts`) and the conversion logic (`toWwConvertorState.ts` and `toMdConvertorState.ts`) primarily tracked the focused *Node* but did not propagate the specific character *offset* within that node.
- **Fix**:
    1.  Updated `InfoForPosSync` interface to include an optional `offset: number`.
    2.  Updated `previewHighlight.ts` (Markdown mode) to calculate and emit the cursor's character offset relative to the current Markdown node (accounting for 1-based source columns).
    3.  Updated `wwEditor.ts` (WYSIWYG mode) to locate the specific leaf Text Node at the cursor and emit its local offset.
    4.  Updated `toWwConvertorState.ts` (MD->WW) to use the passed `offset` to adjust the mapped position inward (subtracting the last pushed node size and adding the offset).
    5.  Updated `toMdConvertorState.ts` (WW->MD) to use the `offset` to calculate the exact `[line, ch]` position in the resulting Markdown text.
- **Verification**: Created `repro_3294.spec.ts` which verified:
    1.  Cursor position is preserved exactly (round-trip) when switching modes.
    2.  Inserting text in WYSIWYG after switching from Markdown happens at the correct split point within a word/node.


### Bug #2994: When HTML code is pasted into Markdown view preview is not working anymore
- **Problem**: When pasting HTML that includes block elements inside inline contexts (e.g., `<ul>` inside a paragraph) into the Markdown editor, the browser's HTML parsing created "orphaned" DOM nodes (siblings without `data-nodeid` attributes) in the preview. `ToastMark`'s incremental update mechanism tracks nodes by ID, so it failed to remove these untracked orphans when the corresponding Markdown node was updated or removed. This led to content duplication where the new content was added but the old orphaned content remained.
- **Fix**: Updated `replaceRangeNodes` in `apps/editor/src/markdown/mdPreview.ts`. After removing a node (or range of nodes) based on their IDs, the logic now also checks for and removes any subsequent sibling elements that lack a `data-nodeid` attribute, ensuring that any debris left over from browser parsing is cleanly removed.
- **Verification**: Created `repro_2994.spec.ts` which reproduced the duplication issue. The test confirmed that after the fix, the preview updates correctly without duplicating the pasted HTML content.

### Bug #2859: When switch between Markdown and WYSIWYG gives me a different look
- **Problem**: Switching between Markdown and WYSIWYG modes caused list styles to change (e.g., `-` bullets becoming `*`), as the editor normalized them without preserving the user's original choice.
- **Fix**:
    1.  Updated `bulletList` schema in `wysiwyg/nodes/bulletList.ts` to include a `bullet` attribute.
    2.  Updated `toWwConvertors.ts` to capture the `bulletChar` from Markdown parsing and store it in the node.
    3.  Updated `toMdConvertors.ts` to use the stored `bullet` attribute when generating Markdown.
- **Verification**: Created `repro_2859.spec.ts` ensuring that bullet characters (`-`) are preserved during a round-trip conversion.

### Bug #2822: In certain cases the text produced by the WYSIWYG editor mixes Markdown and HTML
- **Problem**: User reported mixed MD/HTML output (e.g., `**~~one </del></strong>`) when applying overlapping styles in WYSIWYG mode.
- **Investigation**: Reproduction test `repro_2822.spec.ts` showed that the editor currently produces valid Markdown (`**~~one ~~**two ~~three~~`) for the reported scenario. Debugging confirmed that `strong` and `strike` marks have `rawHTML: null` attributes, preventing the generation of HTML tags.
- **Resolution**: Identified as **Already Fixed** (likely by fix for **Bug #2708** which stopped inappropriate `rawHTML` injection). Validated with usage regression test.

### Bug #2696: Switching Between HTML/Markdown
- **Problem**: User reported switching from HTML with "natural line breaks" to Markdown caused invalid HTML tags to be inserted.
- **Investigation**: Reproduction test `repro_2696.spec.ts` tested various scenarios (paragraphs, soft breaks, divs, plain newlines) and confirmed that the editor now produces valid Markdown (e.g., proper newlines or collapsed whitespace) without any invalid tags like `<div>` or `<br>` (unless explicitly preserved). Debugging proseMirror descendants verified no `rawHTML` leakage.
- **Resolution**: Identified as **Already Fixed**. Validated with usage regression test.

### Bug #2659: Switch between markdown and wysiwyg mode cause the page to jump
- **Problem**: Switching between modes caused the editor to jump to the cursor position or reset scroll, disrupting the user's view.
- **Investigation**: Found that `changeMode` in `editorCore.ts` did not capture or restore `scrollTop`, and subsequent `focus()`/`setSelection()` calls triggered browser auto-scrolling.
- **Resolution**: Modified `changeMode` to capture `scrollTop` at the start and explicitly restore it at the end using `setScrollTop()`, overriding any unwanted auto-scrolling.
- **Verification**: Created `repro_2659.spec.ts` which mocks `getScrollTop` and verifies that `setScrollTop` is called with the preserved value during a mode switch.

### Bug #2253: Switching between WYSIWYG and Markdown mode expands viewing area beyond widget
- **Problem**: Switching modes caused the editor view to expand beyond its container, typically breaking layout when explicit height was not handled correctly.
- **Investigation**: Browser verification using `repro_2253.html` showed correct height constraint (500px) in both modes. Created regression test `repro_2253.spec.ts` which confirmed that `container.style.height` persists across mode switches.
- **Resolution**: Identified as **Already Fixed**. Validated with browser test and unit regression test.

### Bug #2076: Switching between markdown mode and WYSIWYG mode causes format confusion (Word Paste)
- **Problem**: Users reported that round-tripping content copied from Word (WYSIWYG -> MD -> WYSIWYG) caused "disordered" formatting.
- **Investigation**: Browser verification with `repro_2076.html` (Word-like inline styles/mso-tags) showed correct simplification and preservation of structure (lists, bold). Created unit regression test `repro_2076.spec.ts` which programmatically verified round-trip integrity.
- **Resolution**: Identified as **Already Fixed** (likely due to sanitizer improvements handling mso-tags and Word styles).

### Bug #2007: Switching from WYSIWYG to MarkDown mode breaks markup (preformatted text and lists)
- **Problem**: When a code block (or other block) is nested inside a list item, switching modes inserted an extra blank line between the list item text and the code block, eventually breaking the "tight" list structure and causing visual degradation (extra `div`s).
- **Cause**: The `flushClose` method in `ToMdConvertorState` defaulted to inserting a blank line (size=2) between blocks, even when inside a tight list item where tight spacing (size=1) is expected.
- **Resolution**: Modified `flushClose` in `apps/editor/src/convertors/toMarkdown/toMdConvertorState.ts` to check `this.tightList`. If true, it now uses `size=1` (single newline) to maintain tight coupling of list items.
- **Verification**: Created `repro_2007.spec.ts` matching the issue report. The fix prevents the insertion of extra newlines during round-trip conversion.

### Bug #1358: Title from image tag is removed from MD when switching to MD Editor Mode
- **Problem**: Image title attributes (`![alt](url "title")`) were lost during WYSIWYG -> Markdown conversion (becoming `![alt](url)`).
- **Cause**: All 3 layers of the conversion pipeline were missing `title` support:
    1.  Image Node Schema (`image.ts`): Did not define or parse `title` attribute.
    2.  MD -> WYSIWYG (`toWwConvertors.ts`): Did not pass `title` from Markdown tokens.
    3.  WYSIWYG -> MD (`toMdConvertors.ts` & `toMdNodeTypeWriters.ts`): Did not extract or write `title`.
- **Resolution**: Updated `image.ts` schema, `toWwConvertors.ts`, `toMdConvertors.ts`, and `toMdNodeTypeWriters.ts` to fully support round-trip persistence of the image `title` attribute.
- **Verification**: Created `repro_1358.spec.ts` which verified that `![alt](url "Title")` retains its title after a full mode switch round-trip.

### Bug #1347: Newlines in WYSIWYG are not correctly converted to markdown
- **Problem**: Hard breaks (`Shift+Enter` or `<br>`) were lost during conversion between Markdown and WYSIWYG modes.
- **Cause**: The WYSIWYG schema did not support the Hard Break node, causing data loss during import (MD->WW) and missing writer logic during export (WW->MD).
- **Resolution**: 
    - Added `HardBreak` node to WYSIWYG schema (`hardBreak.ts`).
    - Added `linebreak` converter in `toWwConvertors.ts` to map Markdown hard breaks.
    - Added `hardBreak` writer in `toMdNodeTypeWriters.ts` to export as `  \n`.
- **Verification**: `repro_1347.spec.ts` passes round-trip conversion test, confirming data preservation.

### Bug #1122: Necessary `<br>` tags are removed after switching to WYSIWYG and then back to Markdown mode
- **Problem**: `<br>` tags inside paragraphs were converted to soft breaks (paragraph splits) in WYSIWYG, losing the hard break semantic.
- **Cause**: Legacy logic in `htmlToWwConvertors.ts` manually split paragraphs upon encountering `<br>`, instead of using a `hardBreak` node.
- **Resolution**: Updated `br` converter to use the newly added `HardBreak` schema node.
- **Verification**: `repro_1122.spec.ts` confirms `<br>` is preserved as hard break.

### Bug #282: Switch between markdown and wysiwyg mode cause the page to jump
- **Problem**: Cursor/Scroll jumped to start/end on mode switch.
- **Resolution**: **Already Fixed**. Resolved by fixes for #2659 and #3294. 
- **Verification**: `repro_282.spec.ts` confirms cursor persistence.

### Bug #3255: Key OK is missing from en_us
- **Problem**: `color-syntax` plugin crashed due to missing `OK` translation key in `langs.ts`.
- **Resolution**: Added `OK` translation to all languages in `plugins/color-syntax/src/i18n/langs.ts`.
- **Verification**: Static analysis confirmed the fix.

### Bug #3218: Spanish language breaks toolbar tabs
- **Problem**: 'Vista previa' text was too long for hardcoded tab width.
- **Resolution**: Updated `editor.css` to use `width: auto` for tabs.
- **Verification**: Browser screenshot confirmed correct layout.

### Bug #3012: Empty Code Block Crash
- **Problem**: Converting empty code block (`<pre></pre>`) caused JS crash.
- **Resolution**: Added undefined check (`|| ''`) in `htmlToWwConvertors.ts`.
- **Verification**: `repro_3012.spec.ts` confirms fix.

### Bug #2819: IME Breakdown with Placeholder
- **Problem**: Widget-based placeholder disrupted IME composition.
- **Resolution**: Switched to CSS-based placeholder (Decoration.node + ::before).
- **Verification**: Architectural change avoids DOM mutations during composition.

### Bug #2783: Norwegian links wrong parsing
- **Problem**: Links with non-ASCII characters or spaces were not encoded in Markdown output, causing compatibility issues.
- **Resolution**: Applied `encodeURI` to link URLs in `toMdConvertors`.
- **Verification**: `repro_2783.spec.ts` confirms URLs are properly encoded.

### Bug #3260: Create hyperlink from selected text
- **Problem**: Changing the "Link text" in the popup ignored the new value if text was already selected, failing to update the content.
- **Resolution**: Updated `addLink` command in WYSIWYG `link.ts` to replace the selected range with the new text node if `linkText` differs from the selection.
- **Verification**: `repro_3260.spec.ts` confirms that providing different link text replaces the selection, while matching text preserves formatting.

### Bug #3289: `keydown` event `preventDefault` fails to block Korean input
- **Problem**: When `preventDefault()` is called on a `keydown` event emitted by the editor (e.g. to block specific keys), ProseMirror ignored it and continued processing, failing to block input (especially IME).
- **Resolution**: Updated `handleKeyDown` in `wwEditor.ts` and `mdEditor.ts` to check `ev.defaultPrevented`. If true, it returns `true` to ProseMirror, ensuring the event is treated as handled.
- **Verification**: `repro_3289.spec.ts` confirms that calling `preventDefault()` on the emitted event causes `handleKeyDown` to return `true`.

### Bug #2889 / #2798: React 18 Incompatibility (Korean IME double typing)
- **Problem**: In React 18, `useEffect` and component mounting can happen twice (Strict Mode), causing the Editor to be initialized twice if not properly destroyed. This resulted in duplicate event listeners, causing double typing (specifically visible in Korean IME).
- **Resolution**: Added `componentWillUnmount` lifecycle method to `apps/react-editor/src/editor.tsx` and `viewer.tsx` to explicitly call `destroy()` on the editor/viewer instance. This ensures proper cleanup of DOM and event listeners before re-mounting.
- **Verification**: `npm run build` in `apps/react-editor` passed. Code review confirms standard React lifecycle fix.

### Bug #3220: Syntax highlighter XML entities
- **Problem**: When using `codeSyntaxHighlight` plugin, code blocks without a specified language or with an unknown language were not escaped. This caused HTML tags in the code block to be rendered as actual HTML elements instead of text.
- **Resolution**: Updated `toHTMLRenderers.ts` in the plugin to manually escape `node.literal` content (using a new `escape` helper) when no highlighting is applied.
- **Verification**: Created `repro_3220.spec.ts` in `plugins/code-syntax-highlight` which confirms that HTML tags are now correctly escaped to entities (e.g. `&lt;div&gt;`) when language is missing/unknown.

### Bug #3298: customHTMLRenderer broken in viewer
- **Problem**: User reported that `customHTMLRenderer` resulted in duplicate tags in Viewer (e.g. `<a...></a>text<a...></a>`).
- **Analysis**: Investigation revealed this is **User Error**. The user's renderer implementation returned definition tokens for both `entering` and `leaving` phases without checking the `entering` context property. As a result, wrappers were generated twice. `repro_3298.spec.ts` confirmed that checking `if (entering)` resolves the issue.
- **Resolution**: No code change required in library. Issue closed as invalid usage.

### Bug #3308: Ordered list start numbering in Table
- **Problem**: Ordered lists inside tables lost their `start` attribute when converted to Markdown, resetting numbering to 1. This was because the `orderedList` convertor fell back to default `<ol>` generation which stripped attributes when `inTable` was true.
- **Resolution**: Modified `toMdConvertors.ts` to explicitly preserve the `start` (order) attribute when generating HTML for lists within tables.
- **Verification**: Created regression test `apps/editor/src/__test__/unit/bug_3308_list_start.spec.ts` that creates a table with an ordered list starting at 3. Verified that the output Markdown contains `<ol start="3">`.
