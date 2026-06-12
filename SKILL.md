# skillbrief

## When To Use

Use skillbrief when an agent needs to turn repository facts into public-content planning material without inventing claims.

## Required Inputs

- A local fixture or text file relevant to the review.

## Side Effects

This skill is local-only. It reads supplied files and writes output to stdout unless the caller redirects it.

## Approval Requirements

Ask for explicit approval before using the output to publish, post, message, create tickets, or modify external systems.

## Examples

Run `npm run smoke` after installing dependencies.

## Verification

Run `npm test`, `npm run check`, and `npm run smoke`.

## Failure Handling

If validation fails, stop and report the failing command instead of continuing to downstream actions.
