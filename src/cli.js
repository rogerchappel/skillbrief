#!/usr/bin/env node
const fs = require('node:fs');
const { buildBrief, parseInput } = require('./index');

const version = require('../package.json').version;
const usage = 'Usage: skillbrief <brief-input.json|->';

function readSource(file) {
  if (file === '-') return fs.readFileSync(0, 'utf8');
  return fs.readFileSync(file, 'utf8');
}

function usageError(message) {
  process.stderr.write(`skillbrief: ${message}\n${usage}\n`);
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.length > 1) usageError(`unexpected operand: ${args[1]}`);
if (args.length === 0) usageError('missing input');

const [arg] = args;
if (arg === '--help' || arg === '-h') {
  process.stdout.write(`${usage}\n\nBuild a traceable repo-to-content brief from local JSON input.\n`);
  process.exit(0);
}

if (arg === '--version' || arg === '-v') {
  process.stdout.write(`${version}\n`);
  process.exit(0);
}

if (arg.startsWith('-') && arg !== '-') usageError(`unknown option: ${arg}`);

try {
  const input = parseInput(readSource(arg));
  process.stdout.write(buildBrief(input));
} catch (error) {
  console.error(`skillbrief: ${error.message}`);
  process.exit(1);
}
