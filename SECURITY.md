# Security Policy

## Supported Versions

Security fixes apply to the current `main` branch.

## Reporting a Vulnerability

Please report suspected vulnerabilities privately through GitHub security advisories or by contacting the maintainer. Do not open a public issue for security-sensitive reports.

Include:

- A short description of the issue.
- Steps to reproduce it with local fixture input when possible.
- Any known impact on generated briefs or package contents.

`skillbrief` is intended to read local JSON and print deterministic Markdown. Report any behavior that unexpectedly writes files, calls external services, or exposes private content.
