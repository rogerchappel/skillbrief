function normalizeList(value, field = 'value') {
  if (value === undefined) return [];
  if (typeof value === 'string') {
    validateSingleLine(value, field);
    return value.trim() ? [value] : [];
  }
  if (!Array.isArray(value)) {
    throw new TypeError(`${field}: expected a string or an array of strings`);
  }
  value.forEach((item, index) => {
    if (typeof item !== 'string') {
      throw new TypeError(`${field}[${index}]: expected a string`);
    }
    validateSingleLine(item, `${field}[${index}]`);
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
  validateSingleLine(value, field);
  if (!value.trim()) return fallback;
  return value;
}
function bullet(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- Gap: no evidence supplied";
}
function buildBrief(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input: expected an object');
  }
  const facts = input;
  const repo = optionalString(facts, 'repo', 'unknown repo');
  const audience = optionalString(facts, 'audience', 'maintainers');
  const commits = normalizeList(facts.recentCommits, 'recentCommits');
  const files = normalizeList(facts.files, 'files');
  const tests = normalizeList(facts.tests, 'tests');
  const risks = normalizeList(facts.risks, 'risks');
  const goals = normalizeList(facts.goals, 'goals');
  const proof = [...commits.map((c) => `Commit: ${c}`), ...files.map((f) => `File: ${f}`)];
  return [`# Content Brief: ${repo}`,'',`Audience: ${audience}`,'', '## Positioning', `${repo} is ready to explain through ${goals.join(', ') || 'a maintainer update'} for ${audience}.`, '', '## Proof Points', bullet(proof), '', '## Suggested Angles', bullet(goals.map((g) => `${g}: lead with verified repository facts before benefits.`)), '', '## Verification', bullet(tests), '', '## Safety Notes', bullet(risks), '', '## Gaps', proof.length ? '- No unsupported claims detected in supplied facts.' : '- Add commits or files before drafting public copy.', ''].join('\n');
}
function parseInput(text) {
  try { return JSON.parse(text); } catch (error) { throw new Error(`Expected JSON input: ${error.message}`); }
}
module.exports = { buildBrief, parseInput, normalizeList };
