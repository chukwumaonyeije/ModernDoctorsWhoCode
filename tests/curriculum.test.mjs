import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createCurriculum } from '../src/utils/curriculum.ts';
import { getReadingMetadata } from '../src/utils/blog.ts';

const ref = id => ({ id });
function fixture() {
  return {
    paths: [{ id: 'path', data: { status: 'published', order: 1 } }],
    courses: [{ id: 'course', data: { path: ref('path'), status: 'published', order: 1, estimatedMinutes: 999 } }],
    lessons: [
      { id: 'second', data: { course: ref('course'), path: ref('obsolete'), article: ref('b'), status: 'published', lessonNumber: 2, estimatedMinutes: 12 } },
      { id: 'first', data: { course: ref('course'), article: ref('a'), status: 'published', lessonNumber: 1, estimatedMinutes: 8 } },
      { id: 'planned', data: { course: ref('course'), article: ref('c'), status: 'draft', lessonNumber: 3, estimatedMinutes: 100 } },
    ],
    articles: ['a', 'b', 'c'].map(id => ({ id, data: { draft: false } })), projects: [],
  };
}
test('summaries derive effort and ordering from visible lessons, ignoring authored totals', () => {
  const graph = createCurriculum(fixture());
  const course = graph.courseContext('course');
  assert.equal(course.estimatedMinutes, 20);
  assert.equal(course.lessonCount, 2);
  assert.deepEqual(course.lessons.map(entry => entry.id), ['first', 'second']);
  assert.equal(graph.pathContext('path').estimatedMinutes, 20);
  assert.equal(graph.pathContext('path').lessonCount, 2);
  const context = graph.articleContext('b');
  assert.equal(context.path.id, 'path');
  assert.equal(context.previousLesson.id, 'first');
  assert.equal(context.nextLesson, undefined);
  assert.equal(context.terminalAction.href, '/courses/course/');
  assert.equal(createCurriculum(fixture(), { includeDrafts: true }).courseContext('course').estimatedMinutes, 120);
});
test('draft parents and draft articles cannot leak into public counts or context', () => {
  for (const kind of ['paths', 'courses', 'articles']) {
    const data = fixture();
    if (kind === 'articles') data.articles[0].data.draft = true;
    else data[kind][0].data.status = 'draft';
    const graph = createCurriculum(data);
    assert.equal(graph.articleContext('a'), undefined);
    assert.equal(graph.lessons.length, kind === 'articles' ? 1 : 0);
  }
});
test('real project destinations and duplicate article membership are handled explicitly', () => {
  const data = fixture();
  data.projects.push({ id: 'project', data: { status: 'idea' } });
  data.courses[0].data.project = ref('project');
  assert.equal(createCurriculum(data).articleContext('b').terminalAction.href, '/courses/course/#course-project');
  data.lessons[0].data.article = ref('a');
  assert.throws(() => createCurriculum(data).articleContext('a'), /multiple lessons/);
});
test('reading time uses editorial overrides or the shared 200-word estimate, independently of lesson effort', () => {
  assert.deepEqual(getReadingMetadata({ body: 'word '.repeat(401), data: {} }), { wordCount: 401, readingTime: 3 });
  assert.equal(getReadingMetadata({ body: 'word '.repeat(401), data: { readingTime: 9 } }).readingTime, 9);
  assert.equal(getReadingMetadata({ body: '', data: {} }).readingTime, 1);
});
