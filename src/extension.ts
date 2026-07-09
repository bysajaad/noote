import * as vscode from 'vscode';
import { SlashCommandProvider } from './provider';

export function activate(context: vscode.ExtensionContext): void {
  const selector: vscode.DocumentSelector = { language: 'markdown' };
  const provider = new SlashCommandProvider();

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(selector, provider, '/'),
  );
}

export function deactivate(): void {}
