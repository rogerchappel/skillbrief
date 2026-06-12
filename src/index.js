function normalizeList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [String(value)];
}
function bullet(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- Gap: no evidence supplied";
}
function buildBrief(input) {
  const facts = input || {};
  const repo = facts.repo || "unknown repo";
  const audience = facts.audience || "maintainers";
  const commits = normalizeList(facts.recentCommits);
  const files = normalizeList(facts.files);
  const tests = normalizeList(facts.tests);
  const risks = normalizeList(facts.risks);
  const goals = normalizeList(facts.goals);
  const proof = [...commits.map((c) => `Commit: ${c}`), ...files.map((f) => `File: ${f}`)];
  return [`# Content Brief: ${repo}`,'',`Audience: ${audience}`,'', '## Positioning', `${repo} is ready to explain through ${goals.join(', ') || 'a maintainer update'} for ${audience}.`, '', '## Proof Points', bullet(proof), '', '## Suggested Angles', bullet(goals.map((g) => `${g}: lead with verified repository facts before benefits.`)), '', '## Verification', bullet(tests), '', '## Safety Notes', bullet(risks), '', '## Gaps', proof.length ? '- No unsupported claims detected in supplied facts.' : '- Add commits or files before drafting public copy.', ''].join('\n');
}
function parseInput(text) {
  try { return JSON.parse(text); } catch (error) { throw new Error(`Expected JSON input: ${error.message}`); }
}
module.exports = { buildBrief, parseInput, normalizeList };
