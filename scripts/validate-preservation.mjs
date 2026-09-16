import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { captureSite, compareDebt, compareSnapshots } from './lib/preservation.mjs';

/** Validation is read-only; candidate generation never overwrites an approved baseline. */
async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--candidate')) throw new Error('Usage: node scripts/validate-preservation.mjs [--candidate]');
  const root = process.cwd();
  const snapshot = await captureSite(root);
  const { referenceIssues, ...manifest } = snapshot;
  if (args.includes('--candidate')) {
    await writeFile(path.join(root, 'baseline/preservation.candidate.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    await writeFile(path.join(root, 'baseline/reference-issues.candidate.json'), `${JSON.stringify(referenceIssues, null, 2)}\n`);
    console.log('Wrote baseline/*.candidate.json for review. Approved manifests were not changed.');
    console.log(`${Object.keys(manifest.pages).length} pages, ${Object.keys(manifest.articles).length} articles, ${Object.keys(manifest.publicAssets).length} public assets; ${referenceIssues.length} reference issues.`);
    return;
  }
  const expected = JSON.parse(await readFile(path.join(root, 'baseline/preservation.json'), 'utf8'));
  const debt = JSON.parse(await readFile(path.join(root, 'baseline/reference-debt.json'), 'utf8'));
  const comparison = compareDebt(referenceIssues, debt);
  const failures = [...compareSnapshots(expected, manifest), ...comparison.unexpected];
  if (failures.length) throw new Error(`Preservation failed (${failures.length}):\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  console.log(`Preservation passed: ${Object.keys(expected.pages).length} pages, ${Object.keys(expected.articles).length} articles, ${Object.keys(expected.publicAssets).length} public assets, ${expected.redirects.length} redirects.`);
  console.log(`Reference checks: ${referenceIssues.length} explicitly recorded issues, no new failures; ${comparison.resolved.length} resolved debt entries.`);
  for (const issue of comparison.resolved) console.log(`Resolved (remove exception in a reviewed change): ${issue}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
