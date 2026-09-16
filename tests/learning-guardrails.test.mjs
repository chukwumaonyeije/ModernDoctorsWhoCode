import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const validator = fileURLToPath(new URL('../scripts/validate-learning-graph.mjs', import.meta.url));

test('the legacy baseline writer refuses to replace an existing approved file', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'dwc-learning-test-'));
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve(tmpdir()));
    assert.ok(path.basename(root).startsWith('dwc-learning-test-'));
    return rm(root, { recursive: true, force: true });
  });
  await mkdir(path.join(root, 'dist'));
  await mkdir(path.join(root, 'baseline'));
  await writeFile(path.join(root, 'dist/index.html'), '<h1>Fixture</h1>');
  const original = '{"version":1,"pages":["/protected/"],"criticalEndpoints":[]}\n';
  const file = path.join(root, 'baseline/protected-routes.json');
  await writeFile(file, original);
  const script = fileURLToPath(new URL('../scripts/site-guardrails.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [script, '--write-baseline'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Refusing to overwrite/);
  assert.equal(await readFile(file, 'utf8'), original);
});

test('build lifecycle enforces the graph validator and a missing course fails it', async (t) => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.prebuild, 'npm run validate:learning');
  const root = await mkdtemp(path.join(tmpdir(), 'dwc-learning-test-'));
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve(tmpdir()));
    assert.ok(path.basename(root).startsWith('dwc-learning-test-'));
    return rm(root, { recursive: true, force: true });
  });
  for (const dir of ['blog/posts', 'paths', 'courses', 'lessons', 'projects', 'channels']) {
    await mkdir(path.join(root, 'src/content', dir), { recursive: true });
  }
  const entries = {
    'blog/posts/article.md': 'title: Article',
    'paths/path.md': 'order: 1',
    'courses/course.md': 'path: path\norder: 1\nestimatedMinutes: 5',
    'lessons/lesson.md': 'article: article\ncourse: course\npath: path\nlessonNumber: 1\nestimatedMinutes: 5',
  };
  for (const [file, data] of Object.entries(entries)) await writeFile(path.join(root, 'src/content', file), `---\n${data}\n---\n`);
  const run = () => spawnSync(process.execPath, [validator], { cwd: root, encoding: 'utf8' });
  let result = run();
  assert.equal(result.status, 0, result.stderr);
  await writeFile(path.join(root, 'src/content/lessons/lesson.md'), '---\narticle: article\ncourse: nonexistent\npath: path\nlessonNumber: 1\nestimatedMinutes: 5\n---\n');
  result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /references missing entry "nonexistent"/);
});

test('publication, identity, project and public ordering defects fail the graph gate', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'dwc-learning-test-'));
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve(tmpdir()));
    assert.ok(path.basename(root).startsWith('dwc-learning-test-'));
    return rm(root, { recursive: true, force: true });
  });
  for (const dir of ['blog/posts', 'paths', 'courses', 'lessons', 'projects', 'channels']) await mkdir(path.join(root, 'src/content', dir), { recursive: true });
  const entries = {
    'blog/posts/original-name.md': 'title: Article\nslug: stable-article',
    'paths/path.md': 'order: 1\nstatus: published',
    'courses/course.md': 'path: path\norder: 1\nstatus: published',
    'lessons/lesson.md': 'article: stable-article\ncourse: course\nlessonNumber: 1\nestimatedMinutes: 5\nstatus: published',
  };
  const write = async (file, data) => writeFile(path.join(root, 'src/content', file), `---\n${data}\n---\n`);
  const reset = async () => { for (const [file, data] of Object.entries(entries)) await write(file, data); };
  const run = () => spawnSync(process.execPath, [validator], { cwd: root, encoding: 'utf8' });
  await reset();
  assert.equal(run().status, 0, 'Explicit article slug and derived lesson path must resolve');
  const cases = [
    ['blog/posts/original-name.md', entries['blog/posts/original-name.md'] + '\ndraft: true', /unpublished/],
    ['paths/path.md', 'order: 1\nstatus: draft', /unpublished/],
    ['courses/course.md', 'path: path\norder: 1\nstatus: draft', /unpublished/],
    ['lessons/lesson.md', entries['lessons/lesson.md'].replace('published', 'draft'), /no published lessons/],
    ['lessons/lesson.md', entries['lessons/lesson.md'].replace('lessonNumber: 1', 'lessonNumber: 2'), /public lessonNumber/],
    ['lessons/lesson.md', entries['lessons/lesson.md'] + '\npath: wrong', /does not match course path/],
    ['courses/course.md', entries['courses/course.md'] + '\nproject: missing', /references missing entry/],
    ['courses/course.md', entries['courses/course.md'].replace('order: 1', 'order: 2'), /public order/],
  ];
  for (const [file, data, expected] of cases) {
    await reset(); await write(file, data);
    const result = run(); assert.equal(result.status, 1, file); assert.match(result.stderr, expected);
  }
  await reset(); await write('lessons/duplicate.md', entries['lessons/lesson.md']);
  const duplicate = run();
  assert.equal(duplicate.status, 1); assert.match(duplicate.stderr, /already assigned/); assert.match(duplicate.stderr, /duplicate lessonNumber/);
});
