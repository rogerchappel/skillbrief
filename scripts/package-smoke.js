const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const packageRoot = path.join(__dirname, '..');
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'skillbrief-package-smoke-'));
const consumerRoot = path.join(temporaryRoot, 'consumer');
const expectedLicense = `MIT License

Copyright (c) 2026 Roger Chappel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || packageRoot,
    encoding: 'utf8',
    input: options.input
  });

  assert.equal(
    result.status,
    options.status ?? 0,
    `${command} ${args.join(' ')} exited with ${result.status}\n${result.stdout || ''}${result.stderr || ''}`
  );
  return result;
}

try {
  const packed = run('npm', ['pack', '--json', '--pack-destination', temporaryRoot]);
  const packResult = JSON.parse(packed.stdout);
  assert.equal(packResult.length, 1, 'npm pack should create exactly one tarball');

  const tarball = path.join(temporaryRoot, packResult[0].filename);
  assert.ok(fs.statSync(tarball).isFile(), 'npm pack should create a tarball');

  fs.mkdirSync(consumerRoot);
  fs.writeFileSync(
    path.join(consumerRoot, 'package.json'),
    JSON.stringify({ name: 'skillbrief-package-consumer', private: true })
  );
  run('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--package-lock=false',
    tarball
  ], { cwd: consumerRoot });

  const installedRoot = path.join(consumerRoot, 'node_modules', 'skillbrief');
  const required = [
    'src/cli.js',
    'src/index.js',
    'fixtures/example.json',
    'docs/RELEASE_CANDIDATE.md',
    'README.md',
    'LICENSE'
  ];
  for (const entry of required) {
    assert.ok(fs.existsSync(path.join(installedRoot, entry)), `installed package missing ${entry}`);
  }

  assert.equal(
    fs.readFileSync(path.join(installedRoot, 'LICENSE'), 'utf8'),
    expectedLicense,
    'installed package LICENSE must contain the complete canonical MIT text'
  );

  const bin = path.join(consumerRoot, 'node_modules', '.bin', 'skillbrief');
  assert.ok(fs.existsSync(bin), 'installed package missing node_modules/.bin/skillbrief');

  const help = run(bin, ['--help'], { cwd: consumerRoot });
  assert.match(help.stdout, /^Usage: skillbrief/m);

  const version = run(bin, ['--version'], { cwd: consumerRoot });
  assert.equal(version.stdout.trim(), packResult[0].version);

  const fixture = run(bin, [path.join(installedRoot, 'fixtures', 'example.json')], { cwd: consumerRoot });
  assert.match(fixture.stdout, /^# Content Brief:/m);

  const stdin = run(bin, ['-'], {
    cwd: consumerRoot,
    input: '{"repo":"installed-stdin","files":"src/index.js"}'
  });
  assert.match(stdin.stdout, /Content Brief: installed-stdin/);

  console.log('package consumer smoke passed');
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
