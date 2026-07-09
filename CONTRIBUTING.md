# Contributing

## Adding a command

1. Add an entry to the `COMMANDS` array in [`src/commands.ts`](src/commands.ts): `label`, `aliases`, `detail`, `documentation`, `kind`, and `snippet` (a [VS Code snippet](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax) string, or a `(today: string) => string` function if the output depends on the current date). No changes to `src/provider.ts` are needed.
2. Add the command to the table in [`README.md`](README.md).
3. Add an integration test case in [`src/test/suite/provider.test.ts`](src/test/suite/provider.test.ts) if the command needs behavior beyond what's already covered (most additions don't).

## Changing trigger or context-detection logic

Trigger placement lives in [`src/provider.ts`](src/provider.ts) (`TRIGGER_RE`); fenced-code-block and inline-code-span detection lives in [`src/context.ts`](src/context.ts), which is pure logic covered by plain unit tests in `src/test/unit/`. Add a test there for any new edge case before changing the implementation.

## Running things locally

```bash
npm install
npm run typecheck
npm run lint
npm run test:unit   # fast, no VS Code download required
npm test            # unit tests + full @vscode/test-electron integration suite
```

Press `F5` in VS Code to try the extension in an Extension Development Host.
