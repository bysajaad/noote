import * as vscode from 'vscode';
import { COMMANDS, SlashCommand } from './commands';
import { isInsideCodeFence, isInsideInlineCode } from './context';

interface CustomSnippet {
  label: string;
  aliases?: string[];
  snippet: string;
}

const TRIGGER_RE = /(^|\s)\/$/;

export class SlashCommandProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.CompletionItem[] | undefined {
    const config = vscode.workspace.getConfiguration(undefined, document.uri);
    if (!config.get<boolean>('mdSlash.enabled', true)) {
      return undefined;
    }

    const linePrefix = document.lineAt(position.line).text.slice(0, position.character);
    if (!TRIGGER_RE.test(linePrefix)) {
      return undefined;
    }

    const precedingLines: string[] = [];
    for (let line = 0; line < position.line; line++) {
      precedingLines.push(document.lineAt(line).text);
    }
    if (isInsideCodeFence(precedingLines) || isInsideInlineCode(linePrefix)) {
      return undefined;
    }

    const slashColumn = linePrefix.length - 1;
    const range = new vscode.Range(position.line, slashColumn, position.line, position.character);

    const disabled = new Set(config.get<string[]>('mdSlash.disabledCommands', []));
    const customSnippets = config.get<CustomSnippet[]>('mdSlash.customSnippets', []);
    const today = formatDate(new Date());

    const items: vscode.CompletionItem[] = [];
    let sortIndex = 0;

    for (const command of COMMANDS) {
      if (disabled.has(command.label)) {
        continue;
      }
      items.push(buildCompletionItem(command, range, sortIndex++, today));
    }

    for (const custom of customSnippets) {
      if (!custom.label || !custom.snippet || disabled.has(custom.label)) {
        continue;
      }
      items.push(
        buildCompletionItem(
          {
            label: custom.label,
            aliases: custom.aliases ?? [],
            detail: 'Custom snippet',
            documentation: `User-defined snippet from \`mdSlash.customSnippets\`.`,
            kind: vscode.CompletionItemKind.Snippet,
            snippet: custom.snippet,
          },
          range,
          sortIndex++,
          today,
        ),
      );
    }

    return items;
  }
}

function buildCompletionItem(
  command: SlashCommand,
  range: vscode.Range,
  sortIndex: number,
  today: string,
): vscode.CompletionItem {
  const item = new vscode.CompletionItem(command.label, command.kind);
  const body = typeof command.snippet === 'function' ? command.snippet(today) : command.snippet;
  item.insertText = new vscode.SnippetString(body);
  item.range = range;
  item.detail = command.detail;
  item.documentation = new vscode.MarkdownString(command.documentation);
  item.filterText = '/' + [command.label, ...command.aliases].join(' ').toLowerCase();
  item.sortText = String(sortIndex).padStart(3, '0');
  return item;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
