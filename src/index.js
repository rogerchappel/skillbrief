function normalizeList(value, field = 'value') {
  if (value === undefined) return [];
  if (typeof value === 'string') {
    return value.trim() ? [value] : [];
  }
  if (!Array.isArray(value)) {
    throw new TypeError(`${field}: expected a string or an array of strings`);
  }
  value.forEach((item, index) => {
    if (typeof item !== 'string') {
      throw new TypeError(`${field}[${index}]: expected a string`);
    }
  });
  return value.filter((item) => item.trim());
}
function validateSingleLine(value, field) {
  if (/[\r\n]/.test(value)) {
    throw new TypeError(`${field}: expected a single-line string`);
  }
}
function optionalString(facts, field, fallback) {
  const value = facts[field];
  if (value === undefined) return fallback;
  if (typeof value !== 'string') {
    throw new TypeError(`${field}: expected a string`);
  }
  if (!value.trim()) return fallback;
  return value;
}
function bullet(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- Gap: no evidence supplied";
}
// Keep caller-provided text on one physical Markdown line so it cannot create
// headings, bullets, or sections outside the field where it was supplied.
function markdownText(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n");
}
function buildBrief(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input: expected an object');
  }
  const facts = input;
  const repo = markdownText(optionalString(facts, 'repo', 'unknown repo'));
  const audience = markdownText(optionalString(facts, 'audience', 'maintainers'));
  const commits = normalizeList(facts.recentCommits, 'recentCommits');
  const files = normalizeList(facts.files, 'files');
  const tests = normalizeList(facts.tests, 'tests');
  const risks = normalizeList(facts.risks, 'risks');
  const goals = normalizeList(facts.goals, 'goals');
  const proof = [...commits.map((c) => `Commit: ${markdownText(c)}`), ...files.map((f) => `File: ${markdownText(f)}`)];
  const safeGoals = goals.map(markdownText);
  return [`# Content Brief: ${repo}`,'',`Audience: ${audience}`,'', '## Positioning', `${repo} is ready to explain through ${safeGoals.join(', ') || 'a maintainer update'} for ${audience}.`, '', '## Proof Points', bullet(proof), '', '## Suggested Angles', bullet(safeGoals.map((g) => `${g}: lead with verified repository facts before benefits.`)), '', '## Verification', bullet(tests.map(markdownText)), '', '## Safety Notes', bullet(risks.map(markdownText)), '', '## Gaps', proof.length ? '- No unsupported claims detected in supplied facts.' : '- Add commits or files before drafting public copy.', ''].join('\n');
}
function parseInput(text) {
  try { return JSON.parse(text); } catch (error) { throw new Error(`Expected JSON input: ${error.message}`); }
}
module.exports = { buildBrief, parseInput, normalizeList };
