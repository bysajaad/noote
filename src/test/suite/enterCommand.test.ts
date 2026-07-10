import * as assert from 'assert';
import * as vscode from 'vscode';
import { ENTER_COMMAND_ID } from '../../enterCommand';

async function openWithCursorAtEnd(content: string): Promise<vscode.TextEditor> {
  const doc = await vscode.workspace.openTextDocument({ language: 'markdown', content });
  const editor = await vscode.window.showTextDocument(doc);
  const lastLine = doc.lineAt(doc.lineCount - 1);
  const end = lastLine.range.end;
  editor.selection = new vscode.Selection(end, end);
  return editor;
}

suite('Enter key list continuation (integration)', () => {
  suiteSetup(async () => {
    const extension = vscode.extensions.getExtension('bysajaad.noote');
    assert.ok(extension);
    await extension!.activate();
  });

  test('continues a bullet list on enter', async () => {
    const editor = await openWithCursorAtEnd('- item');
    await vscode.commands.executeCommand(ENTER_COMMAND_ID);
    assert.strictEqual(editor.document.getText(), '- item\n- ');
    assert.deepStrictEqual(
      [editor.selection.active.line, editor.selection.active.character],
      [1, 2],
    );
  });

  test('exits an empty bullet item on enter', async () => {
    const editor = await openWithCursorAtEnd('- ');
    await vscode.commands.executeCommand(ENTER_COMMAND_ID);
    assert.strictEqual(editor.document.getText(), '');
    assert.deepStrictEqual(
      [editor.selection.active.line, editor.selection.active.character],
      [0, 0],
    );
  });

  test('continues a numbered list, incrementing the number', async () => {
    const editor = await openWithCursorAtEnd('3. item');
    await vscode.commands.executeCommand(ENTER_COMMAND_ID);
    assert.strictEqual(editor.document.getText(), '3. item\n4. ');
  });

  test('continues a todo item with a fresh unchecked box', async () => {
    const editor = await openWithCursorAtEnd('- [x] done');
    await vscode.commands.executeCommand(ENTER_COMMAND_ID);
    assert.strictEqual(editor.document.getText(), '- [x] done\n- [ ] ');
  });

  test('falls back to a plain newline on a non-list line', async () => {
    const editor = await openWithCursorAtEnd('hello');
    await vscode.commands.executeCommand(ENTER_COMMAND_ID);
    assert.strictEqual(editor.document.getText(), 'hello\n');
  });
});
