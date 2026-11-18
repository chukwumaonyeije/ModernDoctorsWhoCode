import assert from 'node:assert/strict';
import { test } from 'node:test';
import { articleSearchScore, articleSearchText } from '../src/utils/article-search.ts';

const article = { title: 'Retire the Typing Olympics', description: 'Clinical documentation', category: 'AI', keywords: ['physician-developer'], text: 'The keyboard had been served. Tradition was satisfied.' };
test('search finds reordered words, body text, and punctuation variants', () => {
  assert.ok(articleSearchScore(article, 'olympics typing'));
  assert.ok(articleSearchScore(article, 'tradition keyboard'));
  assert.ok(articleSearchScore(article, 'physician developer'));
  assert.equal(articleSearchScore(article, 'typing banana'), 0);
  assert.ok(articleSearchScore(article, 'typing') > articleSearchScore(article, 'keyboard'));
});
test('index excludes comments and component attributes', () => {
  assert.equal(articleSearchText('import Card from "card";\n{/* secret */}\n<!-- hidden -->\n<Card prompt="unspoken">Visible [words](/link)</Card>'), 'Visible words');
});
