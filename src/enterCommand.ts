import * as vscode from 'vscode';
import { computeEnterAction } from './listContinuation';

export const ENTER_COMMAND_ID = 'noote.onEnterKey';

export function registerEnterCommand(context: vscode.ExtensionContext): void {
  context.subscriptions.push(vscode.commands.registerCommand(ENTER_COMMAND_ID, onEnterKey));
}

// A plain command (not registerTextEditorCommand): its returned promise is
// awaited by executeCommand, which our async editor.edit() calls rely on.
// registerTextEditorCommand's edit builder is only valid synchronously and
// would race any async work here.
async function onEnterKey(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const { selections, document } = editor;
  if (selections.length !== 1 || !selections[0].isEmpty) {
    await vscode.commands.executeCommand('type', { text: '\n' });
    return;
  }

  const position = selections[0].active;
  const lineText = document.lineAt(position.line).text;
  const action = computeEnterAction(lineText);

  if (action.type === 'default') {
    await vscode.commands.executeCommand('type', { text: '\n' });
    return;
  }

  if (action.type === 'exit') {
    const line = document.lineAt(position.line);
    await editor.edit((editBuilder) => {
      editBuilder.replace(line.range, action.indent);
    });
    const newPosition = new vscode.Position(position.line, action.indent.length);
    editor.selection = new vscode.Selection(newPosition, newPosition);
    return;
  }

  await editor.edit((editBuilder) => {
    editBuilder.insert(position, `\n${action.indent}${action.nextMarker}`);
  });
  const newPosition = new vscode.Position(
    position.line + 1,
    action.indent.length + action.nextMarker.length,
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
}
