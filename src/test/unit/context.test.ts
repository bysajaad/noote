import * as assert from 'assert';
import { isInsideCodeFence, isInsideInlineCode } from '../../context';

suite('isInsideCodeFence', () => {
  test('returns false with no fences', () => {
    assert.strictEqual(isInsideCodeFence(['# hello', 'world']), false);
  });

  test('returns true right after an opening fence', () => {
    assert.strictEqual(isInsideCodeFence(['```ts']), true);
  });

  test('returns false after a matching closing fence', () => {
    assert.strictEqual(isInsideCodeFence(['```ts', 'const x = 1;', '```']), false);
  });

  test('treats ~~~ fences the same as ```', () => {
    assert.strictEqual(isInsideCodeFence(['~~~', 'code']), true);
    assert.strictEqual(isInsideCodeFence(['~~~', 'code', '~~~']), false);
  });

  test('does not close a ``` fence with a ~~~ fence', () => {
    assert.strictEqual(isInsideCodeFence(['```', 'code', '~~~']), true);
  });

  test('handles indented fences inside list items', () => {
    assert.strictEqual(isInsideCodeFence(['  ```js']), true);
  });
});

suite('isInsideInlineCode', () => {
  test('returns false with no backticks', () => {
    assert.strictEqual(isInsideInlineCode('plain text'), false);
  });

  test('returns true with an unclosed backtick', () => {
    assert.strictEqual(isInsideInlineCode('some `code'), true);
  });

  test('returns false after a closed inline code span', () => {
    assert.strictEqual(isInsideInlineCode('some `code` and more '), false);
  });

  test('handles double-backtick delimiters', () => {
    assert.strictEqual(isInsideInlineCode('some ``code``'), false);
    assert.strictEqual(isInsideInlineCode('some ``code with ` backtick'), true);
  });
});
