# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains only `project-brief.md` (the spec) and `LICENSE`. No code has been scaffolded yet. **`project-brief.md` is the source of truth** — read it in full before starting implementation work; the summary below is not a substitute for it.

## What this is

A VS Code extension ("noote") that adds Outline/Notion-style slash commands to plain markdown files: typing `/` opens a filterable menu of block commands (headings, todos, tables, code blocks, callouts, etc.) that insert as snippets with tab stops. It is the first piece of a larger vision — VS Code + git + markdown as a free, self-owned note-taking backbone — but this extension itself must stay narrow: slash commands only, nothing else.

## Tech stack & hard constraints

- TypeScript, strict mode
- VS Code Extension API only — **no webviews, no custom editors**; native text editing must be preserved
- esbuild for bundling
- Zero runtime dependencies if at all possible — the extension API covers everything needed
- Must work in VSCodium and github.dev/vscode.dev, so avoid Node-only APIs anywhere in the completion path
- Testing: `@vscode/test-electron` + mocha for integration tests; plain unit tests for pure logic (trigger detection, snippet generation)
- Packaging via `vsce`, targeting both VS Code Marketplace and Open VSX
- License: MIT
- No telemetry

## Planned architecture (per project-brief.md)

```
├── src/
│   ├── extension.ts        # activate/deactivate, provider registration
│   ├── provider.ts         # CompletionItemProvider, trigger logic
│   ├── commands.ts         # declarative command definitions
│   ├── context.ts          # code-fence / inline-code detection
│   └── test/
├── .github/workflows/
│   ├── ci.yml               # lint, typecheck, test on push/PR
│   └── release.yml          # tag → vsce package → GitHub Release with .vsix
├── package.json             # contribution points, activation: onLanguage:markdown
├── esbuild.mjs
```

Core mechanic: a single `CompletionItemProvider` registered for `{ language: 'markdown' }` with `/` as the trigger character. Command definitions live in one declarative array in `commands.ts` (`label`, `aliases`, `detail`, `documentation`, `snippet` per entry) so new commands can be added without touching provider logic.

### Trigger rules (this is where correctness lives)

1. Only fire when `/` is at line start or preceded by whitespace (e.g. `/(^|\s)\/$/`) — must not trigger inside `https://` or file paths.
2. **Never** trigger inside fenced code blocks (track ` ``` ` fences above the cursor) or inline code spans — this logic belongs in `context.ts`.
3. Each completion item's `range` must cover the `/` character so accepting a command replaces the slash rather than appending after it.
4. Set `filterText` (including the leading `/`) and `sortText` on every item so partial matches (e.g. `/tab` → "table") and ordering behave intentionally.
5. Use correct `CompletionItemKind` and markdown `documentation` previews per command.

### Configuration surface (contributes.configuration)

- `mdSlash.enabled` (bool, default true)
- `mdSlash.disabledCommands` (string[])
- `mdSlash.customSnippets` (array of `{ label, aliases, snippet }`, merged into the menu)

## Explicit non-goals (this build)

- No webview/custom editor, no WYSIWYG rendering
- No git/GitHub sync features
- No note management, wikilinks, backlinks, or graph views (Foam/Dendron territory)
- No floating UI beyond the native completion widget
- No telemetry

## Future vision (v2 — do not build now)

The eventual goal is Outline Wiki–style WYSIWYG editing of `.md` files in VS Code: editable tables/toggle blocks/dividers as real widgets, a toggle button next to VS Code's existing preview/split buttons to switch WYSIWYG↔raw markdown, and a floating text-selection formatting toolbar. That needs a `CustomTextEditorProvider` + webview (e.g. TipTap/ProseMirror) with a markdown serializer — a different architecture that reverses the no-webview non-goal above. It is intentionally deferred; this build stays on the native `CompletionItemProvider` with zero webview code.

## Definition of done for v1

1. `F5` (Extension Development Host) shows the menu on `/` in a markdown file; all commands insert correctly with working tab stops.
2. No menu inside code fences, inline code, or URLs — covered by tests.
3. Accepting a command replaces the `/`.
4. Integration tests pass in CI (ubuntu-latest at minimum).
5. `vsce package` produces a valid `.vsix`; release workflow attaches it to a GitHub Release on tag push.
6. README documents every command and setting.

## Commands

Not yet applicable — no `package.json` exists. Once scaffolded, standard scripts (build/lint/typecheck/test) should be added here along with how to run a single test.
