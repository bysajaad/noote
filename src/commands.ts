import * as vscode from 'vscode';

/**
 * A snippet body, or a function of today's date (`YYYY-MM-DD`) for commands
 * whose output depends on when they're inserted.
 */
export type SnippetSource = string | ((today: string) => string);

export interface SlashCommand {
  label: string;
  aliases: string[];
  detail: string;
  documentation: string;
  kind: vscode.CompletionItemKind;
  snippet: SnippetSource;
}

function callout(tag: string): SlashCommand {
  const lower = tag.toLowerCase();
  return {
    label: lower[0].toUpperCase() + lower.slice(1),
    aliases: [lower],
    detail: `GFM ${tag} alert`,
    documentation: `Inserts a GitHub-flavored markdown \`[!${tag}]\` alert block.`,
    kind: vscode.CompletionItemKind.Snippet,
    snippet: `> [!${tag}]\n> $0`,
  };
}

export const COMMANDS: SlashCommand[] = [
  {
    label: 'Title',
    aliases: ['title'],
    detail: 'Document title',
    documentation: 'Inserts a top-level heading intended as the document title.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '# $0',
  },
  {
    label: 'Heading 1',
    aliases: ['h1'],
    detail: 'Heading level 1',
    documentation: 'Inserts `# `.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '# $0',
  },
  {
    label: 'Heading 2',
    aliases: ['h2'],
    detail: 'Heading level 2',
    documentation: 'Inserts `## `.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '## $0',
  },
  {
    label: 'Heading 3',
    aliases: ['h3'],
    detail: 'Heading level 3',
    documentation: 'Inserts `### `.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '### $0',
  },
  {
    label: 'Heading 4',
    aliases: ['h4'],
    detail: 'Heading level 4',
    documentation: 'Inserts `#### `.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '#### $0',
  },
  {
    label: 'Todo',
    aliases: ['todo', 'task', 'checkbox'],
    detail: 'GFM task list item',
    documentation: 'Inserts `- [ ] `.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '- [ ] $0',
  },
  {
    label: 'Bulleted list',
    aliases: ['bullet', 'ul'],
    detail: 'Unordered list item',
    documentation: 'Inserts `- `.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '- $0',
  },
  {
    label: 'Numbered list',
    aliases: ['number', 'ol'],
    detail: 'Ordered list item',
    documentation: 'Inserts `1. `.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '1. $0',
  },
  {
    label: 'Strikethrough',
    aliases: ['strikethrough', 'strike'],
    detail: 'GFM strikethrough',
    documentation: 'Inserts `~~text~~`.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '~~$1~~$0',
  },
  {
    label: 'Underline',
    aliases: ['underline'],
    detail: 'Underlined text (HTML fallback)',
    documentation: 'Inserts `<u>text</u>` — there is no native GFM underline syntax.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '<u>$1</u>$0',
  },
  {
    label: 'Table',
    aliases: ['table'],
    detail: '3x2 GFM table',
    documentation: 'Inserts a 3-column, 2-row GFM table skeleton with a tab stop per cell.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet:
      '| ${1:Header 1} | ${2:Header 2} | ${3:Header 3} |\n' +
      '| --- | --- | --- |\n' +
      '| ${4:Cell} | ${5:Cell} | ${6:Cell} |\n$0',
  },
  {
    label: 'Quote',
    aliases: ['quote', 'blockquote'],
    detail: 'Blockquote',
    documentation: 'Inserts `> `.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '> $0',
  },
  {
    label: 'Code block',
    aliases: ['code', 'fence'],
    detail: 'Fenced code block',
    documentation: 'Inserts a fenced code block with a tab stop on the language.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '```${1:language}\n$0\n```',
  },
  {
    label: 'Toggle block',
    aliases: ['toggle', 'details', 'collapsible'],
    detail: 'Collapsible <details> block',
    documentation: 'Inserts a `<details><summary>` collapsible block.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '<details>\n<summary>${1:Summary}</summary>\n\n$0\n\n</details>',
  },
  {
    label: 'Divider',
    aliases: ['divider', 'hr'],
    detail: 'Horizontal rule',
    documentation: 'Inserts `---`.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '---\n$0',
  },
  {
    label: 'Page break',
    aliases: ['pagebreak', 'break'],
    detail: 'Page break marker',
    documentation:
      'Inserts a `<!-- pagebreak -->` marker. Rendering is tool-dependent — there is no universal GFM equivalent.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '<!-- pagebreak -->\n$0',
  },
  {
    label: 'Link',
    aliases: ['link'],
    detail: 'Inline link',
    documentation: 'Inserts `[text](url)`.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '[${1:text}](${2:url})$0',
  },
  {
    label: 'Image',
    aliases: ['image', 'img'],
    detail: 'Inline image',
    documentation: 'Inserts `![alt](url)`.',
    kind: vscode.CompletionItemKind.Snippet,
    snippet: '![${1:alt}](${2:url})$0',
  },
  {
    label: 'Date',
    aliases: ['date', 'today'],
    detail: "Today's date",
    documentation: "Inserts today's date as `YYYY-MM-DD`, computed at insert time.",
    kind: vscode.CompletionItemKind.Snippet,
    snippet: (today) => today,
  },
  callout('NOTE'),
  callout('TIP'),
  callout('WARNING'),
  callout('IMPORTANT'),
  callout('CAUTION'),
];
