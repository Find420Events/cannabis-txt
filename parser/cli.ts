/**
 * Command-line validator for cannabis.txt family files.
 *
 *   node parser/cli.ts <path-or-url> [--json|--model]
 *
 * Prints the achieved conformance level (0-3), a badge line, and
 * diagnostics. --json prints a structured validation report
 * ({ specification, version, valid, errors, warnings, notes });
 * --model prints the full canonical JSON output model.
 */

import { readFileSync } from 'node:fs';
import { parseCannabisTxt, conformance } from './parse.ts';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const asJson = args.includes('--json');
const asModel = args.includes('--model');

if (!target) {
  console.error('Usage: node parser/cli.ts <path-or-url> [--json|--model]');
  process.exit(2);
}

const specification = target.match(/cannabis[a-z0-9-]*\.txt/i)?.[0]?.toLowerCase();

const content = /^https?:\/\//i.test(target)
  ? await (await fetch(target)).text()
  : readFileSync(target, 'utf8');

const result = parseCannabisTxt(content, specification ? { specification } : {});
const { level, diagnostics } = conformance(result);
const all = [...result.diagnostics, ...diagnostics];
const pick = (l: string) =>
  all.filter((d) => d.level === l).map(({ code, line, message }) => ({ code, line, message }));

const spec = result.specification ?? target.split('/').pop() ?? 'cannabis.txt';
const version = typeof result.metadata['version'] === 'string' ? result.metadata['version'] : null;
const valid = level >= 2 && !all.some((d) => d.level === 'error');
const badge = `${spec}: ${version ? `v${version}` : 'unversioned'} ${valid ? '✓' : '✗'}`;

if (asModel) {
  console.log(JSON.stringify(result, null, 2));
} else if (asJson) {
  console.log(
    JSON.stringify(
      {
        specification: spec,
        version,
        'conformance-level': level,
        valid,
        errors: pick('error'),
        warnings: pick('warning'),
        notes: pick('note'),
      },
      null,
      2,
    ),
  );
} else {
  console.log(`${target}`);
  console.log(`  specification: ${result.specification ?? 'unknown'}`);
  console.log(`  conformance level: ${level} of 3`);
  console.log(`  ${badge}`);
  if (!all.length) {
    console.log('  no findings');
  }
  for (const d of all) {
    const where = d.line ? `line ${d.line}: ` : '';
    console.log(`  ${d.level.padEnd(7)} ${d.code.padEnd(22)} ${where}${d.message}`);
  }
}

process.exitCode = level >= 2 ? 0 : 1;
