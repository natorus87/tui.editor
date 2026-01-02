# Known Issues & Bugs (TODO)

This file summarizes **all 293 open bugs** from the original [tui.editor repository](https://github.com/nhn/tui.editor/issues?q=state%3Aopen+label%3ABug) as of today. They are categorized to help prioritize fixes.

## 🔥 Critical & High Priority
Issues that cause crashes, data loss, or severe usability breakage.

- **#3324**: TUI Image Editor fails to initialize inside Froala Editor in Vue with remote backend images.

## 🔄 WYSIWYG ↔ Markdown Sync & Conversion
Issues where switching modes or converting content breaks formatting or data.

## ⌨️ Input, IME & Internationalization
Issues with non-English languages (Korean, Spanish, etc.), keyboard events, and IME.

- **#2392**: Windows IME with Chrome(Edge) gets duplicated when typing symbols.
- **#2363**: Copying Chinese font format from Word document will lack the closing label.
- **#1331**: Can't create a list in WYSIWYG when entering Chinese from Mac "Pinyin Simplified".
- **#1196**: typing Korean in iOS not working well.

## 🖱️ Cursor, Selection & Focus
Issues with cursor jumping, selection loss, or focus handling.

- **#3235**: Selecting text area inside table -> whole recognition issue.
- **#1762**: Triggering focus with mouse limited when height is set to auto.
- **#1352**: focus/blur issues during editing.
- **#1098**: Cursor position not setable in wysiwyg editor with long texts on iOS devices.
- **#1008**: TypeError during blur event in WYSIWYG mode.

## 📝 Parsing, Rendering & Formatting
Issues with how specific syntax (tables, lists, code blocks, HTML) is parsed or rendered.

- **#3084**: bug on marked syntax (highlight) when `insertText` with `\n`.
- **#2586**: `<br>` tag added by WYSIWYG produces markdown that does not render correctly.
- **#2480**: Editor scrolls while copy->paste long content.
- **#2394**: `<br>` tag is added to markdown when adding multiple new lines in WYSIWYG mode.


## 🔌 Plugins & Wrappers (React, Vue)
Issues specific to the helper libraries and plugins.

- **#3206**: React Editor wrapper sets "Write Preview" in input.
- **#3186**: Bug with chart plugin and tab previewStyle in vue3.
- **#3072**: `toast-ui/vue-editor` invoke("getHTML"): Error "TypeError: matched is null".
- **#2970**: Chart plugin with type pie always fails to render data.
- **#2797**: Vue-editor: In Firefox, spaces are removed while typing.
- **#1076**: React Editor memory leak.

## 🏗️ Build, Environment & Legacy (IE11)
Issues with building the project, browser compatibility, and dependencies.

- **#3293**: CORS error when using `import(...)`.
- **#3081**: Editor no longer compatible with IE11 after 3.2.0.
- **#2996**: Editor not working in IE11.
- **#1248**: React Editor will not install with React v17.
- **#1089**: typescript error.
- **#748**: If do npm install, will get a bug. If do yarn install, it will not occur.
