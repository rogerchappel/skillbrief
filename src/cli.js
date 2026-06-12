#!/usr/bin/env node
const fs = require('node:fs');
const { buildBrief, parseInput } = require('./index');
function readSource(argv) {
  const file = argv[2];
  if (!file || file === '-') return fs.readFileSync(0, 'utf8');
  return fs.readFileSync(file, 'utf8');
}
try {
  const input = parseInput(readSource(process.argv));
  process.stdout.write(buildBrief(input));
} catch (error) {
  console.error(`skillbrief: ${error.message}`);
  process.exit(1);
}
