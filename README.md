# skillbrief

Traceable repo-to-content brief generator for launch posts and demo preparation.

## Quickstart

```sh
npm test
npm run smoke
npm run release:check
```

## CLI

Run the CLI against the included fixture.

```sh
npm run smoke
```

## Release Verification

```sh
npm run package:smoke
npm run release:check
```

`package:smoke` runs `npm pack --dry-run` and confirms the package includes the
CLI, library source, fixture, release notes, README, and license. `release:check`
combines syntax checks, tests, the fixture smoke, and package smoke for CI.

## Library

Import from `src/index.js` in local automation.

## Limitations

The package is intentionally local-first and does not publish, post, or write to external systems.

## Safety

Review generated output before using it in public content or external workflows.

## Example Workflow

1. Prepare the local fixture.
2. Run the smoke command.
3. Review the report before drafting or acting.
