# Noote — Markdown Slash Commands

Outline/Notion-style slash commands for plain markdown files in VS Code. Type `/` at the start of a line (or after whitespace) to open a filterable menu of block commands, inserted as snippets with tab stops — while everything stays a plain `.md` file under git.

> Demo GIF coming soon.

## Usage

Start typing `/` on an empty line (or right after whitespace) in a markdown file. Keep typing to filter by a command's label or alias — e.g. `/tab` or `/table` both match **Table**. Accepting a suggestion replaces the `/` with the inserted snippet and places your cursor at its first tab stop.

The menu does **not** open inside fenced code blocks, inline code spans, or after a non-whitespace character (so it won't fire inside a URL like `https://`).

## Commands

| Command | Aliases | Inserts |
|---|---|---|
| Title | `title` | `# ` |
| Heading 1 | `h1` | `# ` |
| Heading 2 | `h2` | `## ` |
| Heading 3 | `h3` | `### ` |
| Heading 4 | `h4` | `#### ` |
| Todo | `todo`, `task`, `checkbox` | `- [ ] ` |
| Bulleted list | `bullet`, `ul` | `- ` |
| Numbered list | `number`, `ol` | `1. ` |
| Strikethrough | `strikethrough`, `strike` | `~~text~~` |
| Underline | `underline` | `<u>text</u>` |
| Table | `table` | 3×2 GFM table skeleton |
| Quote | `quote`, `blockquote` | `> ` |
| Code block | `code`, `fence` | fenced code block with a tab stop on the language |
| Toggle block | `toggle`, `details`, `collapsible` | `<details><summary>...</summary>...</details>` |
| Divider | `divider`, `hr` | `---` |
| Page break | `pagebreak`, `break` | `<!-- pagebreak -->` |
| Link | `link` | `[text](url)` |
| Image | `image`, `img` | `![alt](url)` |
| Date | `date`, `today` | today's date as `YYYY-MM-DD` |
| Note | `note` | GFM `> [!NOTE]` alert |
| Tip | `tip` | GFM `> [!TIP]` alert |
| Warning | `warning` | GFM `> [!WARNING]` alert |
| Important | `important` | GFM `> [!IMPORTANT]` alert |
| Caution | `caution` | GFM `> [!CAUTION]` alert |

## Configuration

| Setting | Type | Default | Description |
|---|---|---|---|
| `mdSlash.enabled` | `boolean` | `true` | Enable the `/` slash command menu in markdown files. |
| `mdSlash.disabledCommands` | `string[]` | `[]` | Command labels to hide from the menu (e.g. `["Underline"]`). |
| `mdSlash.customSnippets` | `{ label, aliases?, snippet }[]` | `[]` | User-defined commands merged into the menu. `snippet` uses [VS Code snippet syntax](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax) (`$1`, `$0`, etc). |

Example:

```json
"mdSlash.disabledCommands": ["Underline", "Page break"],
"mdSlash.customSnippets": [
  { "label": "Meeting notes", "aliases": ["meeting"], "snippet": "## ${1:Meeting}\n\n- Attendees: $2\n- Notes: $0" }
]
```

## Development

```bash
npm install
npm run compile   # bundle src/extension.ts -> dist/extension.js
npm run watch      # same, in watch mode
```

Press `F5` in VS Code to launch an Extension Development Host with the extension loaded.

```bash
npm run typecheck
npm run lint
npm run test:unit         # plain mocha tests for pure logic (context.ts)
npm test                  # unit tests, then the @vscode/test-electron integration suite
```

## Non-goals

This extension is intentionally narrow: no webviews or custom editors, no WYSIWYG rendering, no git/GitHub sync, no note graph/wikilink features, and no telemetry. See [project-brief.md](project-brief.md) for the full rationale and the longer-term (out-of-scope) vision.

## License

MIT
