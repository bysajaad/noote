import * as assert from 'assert';
import { computeEnterAction } from '../../listContinuation';

suite('computeEnterAction', () => {
  test('falls back to default on a non-list line', () => {
    assert.deepStrictEqual(computeEnterAction('just some text'), { type: 'default' });
  });

  test('continues a bullet list', () => {
    assert.deepStrictEqual(computeEnterAction('- item'), {
      type: 'continue',
      indent: '',
      nextMarker: '- ',
    });
  });

  test('continues bullets using * and + markers', () => {
    assert.deepStrictEqual(computeEnterAction('* item'), {
      type: 'continue',
      indent: '',
      nextMarker: '* ',
    });
    assert.deepStrictEqual(computeEnterAction('+ item'), {
      type: 'continue',
      indent: '',
      nextMarker: '+ ',
    });
  });

  test('exits an empty bullet item', () => {
    assert.deepStrictEqual(computeEnterAction('- '), { type: 'exit', indent: '' });
  });

  test('exits a bullet item with only trailing whitespace', () => {
    assert.deepStrictEqual(computeEnterAction('-   '), { type: 'exit', indent: '' });
  });

  test('continues a numbered list, incrementing the number', () => {
    assert.deepStrictEqual(computeEnterAction('5. item'), {
      type: 'continue',
      indent: '',
      nextMarker: '6. ',
    });
  });

  test('continues a numbered list using the ) delimiter', () => {
    assert.deepStrictEqual(computeEnterAction('1) item'), {
      type: 'continue',
      indent: '',
      nextMarker: '2) ',
    });
  });

  test('exits an empty numbered list item', () => {
    assert.deepStrictEqual(computeEnterAction('1. '), { type: 'exit', indent: '' });
  });

  test('continues a todo item, always with a fresh unchecked box', () => {
    assert.deepStrictEqual(computeEnterAction('- [ ] task'), {
      type: 'continue',
      indent: '',
      nextMarker: '- [ ] ',
    });
    assert.deepStrictEqual(computeEnterAction('- [x] done task'), {
      type: 'continue',
      indent: '',
      nextMarker: '- [ ] ',
    });
  });

  test('exits an empty todo item', () => {
    assert.deepStrictEqual(computeEnterAction('- [ ] '), { type: 'exit', indent: '' });
  });

  test('preserves indentation for nested lists', () => {
    assert.deepStrictEqual(computeEnterAction('  - item'), {
      type: 'continue',
      indent: '  ',
      nextMarker: '- ',
    });
  });
});
