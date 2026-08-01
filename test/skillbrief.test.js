const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { buildBrief, parseInput } = require('../src/index');

const cli = path.join(__dirname, '..', 'src', 'cli.js');
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

test('accepts supported scalar and list values', () => {
  const brief = buildBrief({
    repo: 'demo',
    audience: 'maintainers',
    recentCommits: 'abc123',
    files: ['src/index.js'],
    tests: 'npm test',
    risks: [],
    goals: 'release notes'
  });

  assert.match(brief, /Commit: abc123/);
  assert.match(brief, /File: src\/index\.js/);
  assert.match(brief, /- npm test/);
});

test('rejects non-object input roots', () => {
  for (const input of [null, [], 'brief', 42, true]) {
    assert.throws(() => buildBrief(input), /input: expected an object/);
  }
});

test('rejects invalid scalar fields', () => {
  for (const field of ['repo', 'audience']) {
    assert.throws(
      () => buildBrief({ [field]: 42 }),
      new RegExp(`${field}: expected a string`)
    );
  }
});

test('rejects invalid list fields and entries', () => {
  for (const field of ['recentCommits', 'files', 'tests', 'risks', 'goals']) {
    assert.throws(
      () => buildBrief({ [field]: { value: 'unsupported' } }),
      new RegExp(`${field}: expected a string or an array of strings`)
    );
    assert.throws(
      () => buildBrief({ [field]: ['valid', { value: 'unsupported' }] }),
      new RegExp(`${field}\\[1\\]: expected a string`)
    );
    assert.throws(
      () => buildBrief({ [field]: 42 }),
      new RegExp(`${field}: expected a string or an array of strings`)
    );
  }
});

test('CLI accepts fixture files and stdin', () => {
  const fixture = spawnSync(process.execPath, [cli, path.join(__dirname, '..', 'fixtures', 'example.json')], { encoding: 'utf8' });
  assert.equal(fixture.status, 0, fixture.stderr);
  assert.match(fixture.stdout, /# Content Brief:/);

  const stdin = spawnSync(process.execPath, [cli, '-'], {
    input: '{"repo":"stdin-demo","files":"src/index.js"}',
    encoding: 'utf8'
  });
  assert.equal(stdin.status, 0, stdin.stderr);
  assert.match(stdin.stdout, /Content Brief: stdin-demo/);
});

test('CLI reports field-specific validation errors', () => {
  const invalidRoot = spawnSync(process.execPath, [cli, '-'], { input: '[]', encoding: 'utf8' });
  assert.equal(invalidRoot.status, 1);
  assert.match(invalidRoot.stderr, /skillbrief: input: expected an object/);
  assert.equal(invalidRoot.stdout, '');

  const invalidEntry = spawnSync(process.execPath, [cli, '-'], {
    input: '{"files":[{"path":"src/index.js"}]}',
    encoding: 'utf8'
  });
  assert.equal(invalidEntry.status, 1);
  assert.match(invalidEntry.stderr, /skillbrief: files\[0\]: expected a string/);
  assert.equal(invalidEntry.stdout, '');
});
