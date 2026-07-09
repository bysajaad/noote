# Project Brief: Markdown Slash Commands — VS Code Extension

## What we're building

A VS Code extension that brings Outline/Notion-style **slash commands** to plain markdown files. Typing `/` at the start of a line (or after whitespace) opens a filterable menu of block commands — headings, todos, tables, code blocks, callouts — inserted as snippets with tab stops. The goal: make VS Code feel like a modern block editor for notes, while keeping everything as plain `.md` files under git.

This is the first piece of a larger vision: VS Code + git + markdown as a free, unlimited, self-owned note-taking backbone. The extension must stay narrow and excellent — slash commands done right, nothing else.

## Tech stack & constraints

- **Language:** TypeScript, strict mode
- **Platform:** VS Code Extension API (no webviews, no custom editors — native text editing must be preserved)
- **Bundler:** esbuild (fast, standard for extensions)
- **Testing:** @vscode/test-electron + mocha for integration tests; plain unit tests for pure logic (trigger detection, snippet generation)
- **Packaging:** vsce, ready for VS Code Marketplace + Open VSX
- **License:** MIT
- **Zero runtime dependencies** if possible — the extension API covers everything we need
- **Must also work in VSCodium and github.dev/vscode.dev** (pure API usage, no node-only tricks in the completion path)

## Core mechanic

Register a `CompletionItemProvider` for `{ language: 'markdown' }` with `/` as the trigger character.

Trigger rules (this is where quality lives):
1. Fire only when `/` is at line start or preceded by whitespace — regex on the line prefix like `/(^|\s)\/$/`. This prevents the menu from opening inside `https://` and file paths.
2. **Never** fire inside fenced code blocks (track ``` fences above the cursor) or inline code spans.
3. Each completion item's `range` must cover the `/` character so accepting a command replaces the slash instead of appending after it.
4. Set `filterText` (including the leading `/`) and `sortText` on every item so typing `/tab` matches "table" and ordering is intentional.
5. Use appropriate `CompletionItemKind` and markdown `documentation` previews showing what each command inserts.

## v1 command set

Each command is a `SnippetString` with sensible tab stops (`$1`, `$0`):

| Command | Aliases | Inserts |
|---|---|---|
| Heading 1–4 | h1, h2, h3, h4 | `# $0` etc. |
| Title | title | `# $0` (top-of-document heading, listed separately from h1 for discoverability) |
| Todo | todo, task, checkbox | `- [ ] $0` |
| Bulleted list | bullet, ul | `- $0` |
| Numbered list | number, ol | `1. $0` |
| Strikethrough | strikethrough, strike | `~~$1~~$0` |
| Underline | underline | `<u>$1</u>$0` (no native GFM syntax; HTML fallback) |
| Table | table | 3×2 GFM table skeleton with tab stops per cell |
| Quote | quote, blockquote | `> $0` |
| Code block | code, fence | ```` ```$1 ⏎ $0 ⏎ ``` ```` (tab stop on language) |
| Toggle block | toggle, details, collapsible | `<details><summary>$1</summary>` block |
| Divider | divider, hr | `---` |
| Page break | pagebreak, break | `<!-- pagebreak -->$0` (rendering is tool-dependent; no universal GFM equivalent) |
| Link | link | `[$1]($2)$0` |
| Image | image, img | `![$1]($2)$0` |
| Date | date, today | today's date `YYYY-MM-DD` (computed at insert) |
| Callouts | note, tip, warning, important, caution | GFM alerts: `> [!NOTE]` etc. |

The list is intentionally open-ended — any other standard markdown/GFM construct (footnotes, definition lists, subscript/superscript HTML fallbacks, etc.) can be added the same way: one entry in `commands.ts`, no provider changes.

Command definitions live in a single declarative array (`src/commands.ts`) — one object per command with `label`, `aliases`, `detail`, `documentation`, `snippet` — so contributors can add commands without touching provider logic.

## Configuration (contributes.configuration)

- `mdSlash.enabled` (bool, default true)
- `mdSlash.disabledCommands` (string[], hide specific commands)
- `mdSlash.customSnippets` (array of `{ label, aliases, snippet }` — user-defined commands merged into the menu)

## Repo structure

```
├── src/
│   ├── extension.ts        # activate/deactivate, provider registration
│   ├── provider.ts         # CompletionItemProvider, trigger logic
│   ├── commands.ts         # declarative command definitions
│   ├── context.ts          # code-fence / inline-code detection
│   └── test/
├── syntaxes/               # (none needed — plain markdown)
├── .github/workflows/
│   ├── ci.yml              # lint, typecheck, test on push/PR
│   └── release.yml         # tag → vsce package → GitHub Release with .vsix
├── package.json            # contribution points, activation: onLanguage:markdown
├── esbuild.mjs
├── CHANGELOG.md
├── CONTRIBUTING.md         # how to add a command (edit commands.ts, add test)
└── README.md               # GIF demo placeholder, command table, config docs
```

## Definition of done for v1

1. `F5` (Extension Development Host) shows the menu on `/` in a markdown file; all commands insert correctly with working tab stops.
2. No menu inside code fences, inline code, or URLs — covered by tests.
3. Accepting a command replaces the `/`.
4. Integration tests pass in CI (ubuntu-latest at minimum).
5. `vsce package` produces a valid `.vsix`; release workflow attaches it to a GitHub Release on tag push.
6. README documents every command and setting.

## Explicit non-goals (do not build in this v1)

- No webview/custom editor, no WYSIWYG rendering
- No git/GitHub sync features (VS Code already has git)
- No note management, wikilinks, backlinks, or graph views (Foam/Dendron territory)
- No floating UI beyond the native completion widget
- No telemetry

## Future vision (v2 — explicitly out of scope for this build)

The end goal beyond this extension is to bring Outline Wiki–style `.md` editing to VS Code: a true WYSIWYG view (editable tables, toggle blocks, dividers, page breaks as real widgets, not text) with a toggle button — next to VS Code's existing split-view/preview buttons in the editor title bar — to switch between WYSIWYG and raw markdown (the "preview" pane becomes an editable surface instead of read-only render). Alongside it, a floating text-selection toolbar for inline formatting, matching Outline's highlight-menu UX.

That requires a `CustomTextEditorProvider` backed by a webview (e.g. TipTap/ProseMirror) with a markdown serializer keeping the webview's rich-text model in sync with the underlying plain-text `.md` file — a different architecture from v1's native `CompletionItemProvider`, and it directly reverses the "no webview / no WYSIWYG" non-goal above. This is deliberate: v1 ships the narrow slash-command extension only, on the native text editor, zero webview code. Do not pull WYSIWYG/webview/highlight-toolbar work into this build — treat it as a separate future project/extension version once v1 is solid.

## Suggested first tasks

1. Scaffold with `yo code` conventions (TypeScript + esbuild), set up strict tsconfig, eslint.
2. Implement `context.ts` (fence/inline-code detection) with unit tests first — it's pure logic.
3. Implement provider + 3 commands (h1, todo, table), verify UX in the dev host.
4. Fill out the full command set, config options, tests, CI, release workflow, README.