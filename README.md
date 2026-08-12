# skillbrief

Traceable repo-to-content brief generator for launch posts and demo preparation.

## Quickstart

```sh
npm test
npm run smoke
npm run release:check
```

## CLI

Run the CLI with exactly one JSON file operand. Use `-` as the operand to read
JSON from standard input. `--help`/`-h` and `--version`/`-v` are also supported.

```sh
npm run smoke
skillbrief brief-input.json
printf '%s' '{"repo":"demo","files":"README.md"}' | skillbrief -
```

Unknown options, missing input, and extra operands print the usage string to
standard error and exit with status 2. Input and validation failures exit with
status 1.

## Input Format

The JSON root must be an object. `repo` and `audience` are optional single-line strings.
`recentCommits`, `files`, `tests`, `risks`, and `goals` each accept either one
single-line string or an array of single-line strings. Omitted fields use the
report defaults; empty strings, whitespace-only strings, and empty arrays are
treated as missing evidence. Carriage returns and line feeds are rejected in
all string fields so input cannot introduce extra Markdown lines or sections.
Punctuation and other characters within a non-whitespace single line are kept
unchanged.

Other root types, object-valued fields or list entries, numbers, booleans, and
`null` are rejected with a field-specific error. The CLI writes that error to
standard error and exits with a nonzero status instead of producing a brief.

## Release Verification

```sh
npm run package:smoke
npm run release:check
```

`package:smoke` runs `npm pack --dry-run` and confirms the package includes the
CLI, library source, fixture, release notes, README, and license. `release:check`
combines syntax checks, tests, the fixture smoke, and package smoke for CI.

## Library

Import `buildBrief`, `parseInput`, or `normalizeList` from `src/index.js` in
local automation. `buildBrief` enforces the input format above and throws a
`TypeError` for unsupported values.

## Limitations

The package is intentionally local-first and does not publish, post, or write to external systems.

## Safety

Review generated output before using it in public content or external workflows.

## Example Workflow

1. Prepare the local fixture.
2. Run the smoke command.
3. Review the report before drafting or acting.
