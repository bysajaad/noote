import * as assert from 'assert';
import * as vscode from 'vscode';

function labelOf(item: vscode.CompletionItem): string {
  return typeof item.label === 'string' ? item.label : item.label.label;
}

async function getCompletions(
  content: string,
  position: vscode.Position,
): Promise<vscode.CompletionList> {
  const doc = await vscode.workspace.openTextDocument({ language: 'markdown', content });
  const list = await vscode.commands.executeCommand<vscode.CompletionList>(
    'vscode.executeCompletionItemProvider',
    doc.uri,
    position,
  );
  assert.ok(list, 'expected a completion list');
  return list;
}

suite('Slash command completion (integration)', () => {
  suiteSetup(async () => {
    // Ensure the extension is activated (and its provider registered) before
    // any test runs a completion request — activation is async and would
    // otherwise race the first test.
    const extension = vscode.extensions.getExtension('bysajaad.noote');
    assert.ok(extension, 'expected the noote extension to be present');
    await extension!.activate();
  });

  test('suggests commands when triggered at line start', async () => {
    const list = await getCompletions('/', new vscode.Position(0, 1));
    const labels = list.items.map(labelOf);
    assert.ok(labels.includes('Table'));
    assert.ok(labels.includes('Heading 1'));
    assert.ok(labels.includes('Todo'));
  });

  test('suggests commands when triggered after whitespace', async () => {
    const list = await getCompletions('  /', new vscode.Position(0, 3));
    assert.ok(list.items.some((item) => labelOf(item) === 'Divider'));
  });

  test('does not suggest inside a fenced code block', async () => {
    const list = await getCompletions('```\n/', new vscode.Position(1, 1));
    assert.strictEqual(list.items.some((item) => labelOf(item) === 'Table'), false);
  });

  test('does not suggest after a non-whitespace character (e.g. a URL)', async () => {
    const content = 'https://';
    const list = await getCompletions(content, new vscode.Position(0, content.length));
    // VS Code's built-in word-based suggestions may still contribute matches
    // for words already in the document (e.g. "https") — only our own
    // commands must stay absent here.
    assert.strictEqual(list.items.some((item) => labelOf(item) === 'Table'), false);
  });

  test('completion range covers the slash so accepting replaces it', async () => {
    const list = await getCompletions('/', new vscode.Position(0, 1));
    const table = list.items.find((item) => labelOf(item) === 'Table');
    assert.ok(table);
    const range = table!.range as vscode.Range;
    assert.strictEqual(range.start.line, 0);
    assert.strictEqual(range.start.character, 0);
    assert.strictEqual(range.end.character, 1);
  });

  test('filterText allows matching by alias', async () => {
    const list = await getCompletions('/', new vscode.Position(0, 1));
    const todo = list.items.find((item) => labelOf(item) === 'Todo');
    assert.ok(todo);
    assert.ok(todo!.filterText?.includes('checkbox'));
  });
});
