const test = require('node:test');
const assert = require('node:assert/strict');
const { buildBrief, parseInput } = require('../src/index');
test('builds a traceable content brief', () => {
  const brief = buildBrief({ repo: 'demo', audience: 'builders', recentCommits: ['add tests'], files: ['README.md'], tests: ['npm test'], risks: ['dry-run only'], goals: ['launch post'] });
  assert.match(brief, /Content Brief: demo/);
  assert.match(brief, /Commit: add tests/);
  assert.match(brief, /dry-run only/);
});
test('reports gaps when proof is missing', () => {
  assert.match(buildBrief({ repo: 'empty' }), /Add commits or files/);
});
test('parses JSON input', () => {
  assert.equal(parseInput('{"repo":"x"}').repo, 'x');
});
