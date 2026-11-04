/**
 * Command-line validator for cannabis.txt family files.
 *
 *   node parser/cli.ts <path-or-url> [--json]
 *
 * Prints the achieved conformance level (0-3) and diagnostics, or the full
 * canonical JSON model with --json.
 */

import { readFileSync } from 'node:fs';
import { parseCannabisTxt, conformance } from './parse.ts';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const asJson = args.includes('--json');

if (!target) {
  console.error('Usage: node parser/cli.ts <path-or-url> [--json]');
  process.exit(2);
}

const specification = target.match(/cannabis[a-z0-9-]*\.txt/i)?.[0]?.toLowerCase();

const content = /^https?:\/\//i.test(target)
  ? await (await fetch(target)).text()
  : readFileSync(target, 'utf8');

const result = parseCannabisTxt(content, specification ? { specification } : {});
const { level, diagnostics } = conformance(result);
const all = [...result.diagnostics, ...diagnostics];

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`${target}`);
  console.log(`  specification: ${result.specification ?? 'unknown'}`);
  console.log(`  conformance level: ${level} of 3`);
  if (!all.length) {
    console.log('  no findings');
  }
  for (const d of all) {
    const where = d.line ? `line ${d.line}: ` : '';
    console.log(`  ${d.level.padEnd(7)} ${d.code.padEnd(22)} ${where}${d.message}`);
  }
}

process.exitCode = level >= 2 ? 0 : 1;
