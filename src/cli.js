#!/usr/bin/env node
const fs = require('node:fs');
const { buildBrief, parseInput } = require('./index');

const version = require('../package.json').version;

function readSource(argv) {
  const file = argv[2];
  if (!file || file === '-') return fs.readFileSync(0, 'utf8');
  return fs.readFileSync(file, 'utf8');
}

const arg = process.argv[2];
if (arg === '--help' || arg === '-h') {
  process.stdout.write('Usage: skillbrief <brief-input.json|->\n\nBuild a traceable repo-to-content brief from local JSON input.\n');
  process.exit(0);
}

if (arg === '--version' || arg === '-v') {
  process.stdout.write(`${version}\n`);
  process.exit(0);
}

try {
  const input = parseInput(readSource(process.argv));
  process.stdout.write(buildBrief(input));
} catch (error) {
  console.error(`skillbrief: ${error.message}`);
  process.exit(1);
}
