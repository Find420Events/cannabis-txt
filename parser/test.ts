/**
 * Parser test suite and conformance fixtures.
 *
 *   node parser/test.ts
 *
 * - Compares parser/fixtures/basic.txt against basic.expected.json.
 * - Parses every repository specification and example file and asserts
 *   expected conformance levels.
 * - Runs unit assertions for grammar rules: duplicates, unknown fields,
 *   unknown/null normalization, records, continuations, Extensions blocks.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { parseCannabisTxt, conformance } from './parse.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

let passed = 0;
const check = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}`);
    console.error(`       ${err instanceof Error ? err.message : err}`);
    process.exitCode = 1;
  }
};

// --- Golden fixture -------------------------------------------------------

check('golden fixture basic.txt matches basic.expected.json', () => {
  const result = parseCannabisTxt(read('parser/fixtures/basic.txt'));
  const expected = JSON.parse(read('parser/fixtures/basic.expected.json'));
  assert.deepEqual(result, expected);
});

// --- Repository files -----------------------------------------------------

const specFiles = readdirSync(root).filter((f) => /^cannabis[a-z0-9-]*\.txt$/.test(f));

for (const file of specFiles) {
  check(`${file} reaches conformance level 3`, () => {
    const result = parseCannabisTxt(read(file), { specification: file });
    const { level, diagnostics } = conformance(result);
    for (const d of [...result.diagnostics, ...diagnostics]) {
      assert.notEqual(d.level, 'error', `${d.code}: ${d.message}`);
    }
    assert.equal(level, 3, `level ${level}; diagnostics: ${JSON.stringify(diagnostics)}`);
  });
}

const exampleFiles = readdirSync(join(root, 'examples'))
  .filter((f) => f.endsWith('.txt'))
  .map((f) => `examples/${f}`);

for (const file of exampleFiles) {
  check(`${file} parses at level 1 or higher`, () => {
    const result = parseCannabisTxt(read(file));
    const { level } = conformance(result);
    assert.ok(level >= 1, `level ${level}`);
  });
}

const find420Files = readdirSync(join(root, 'examples/find420'))
  .filter((f) => f.endsWith('.txt'))
  .map((f) => `examples/find420/${f}`);

for (const file of find420Files) {
  check(`${file} reaches conformance level 3`, () => {
    const result = parseCannabisTxt(read(file));
    const { level, diagnostics } = conformance(result);
    assert.equal(level, 3, `level ${level}; diagnostics: ${JSON.stringify(diagnostics)}`);
  });
}

// --- Unit assertions --------------------------------------------------------

check('duplicate scalar field keeps first occurrence and warns', () => {
  const r = parseCannabisTxt('Version: 1.0.0\nVersion: 9.9.9\n');
  assert.equal(r.metadata['version'], '1.0.0');
  assert.ok(r.diagnostics.some((d) => d.code === 'duplicate-field'));
});

check('unknown fields are preserved without errors', () => {
  const r = parseCannabisTxt('X-Custom-Field: anything\n');
  assert.equal(r.metadata['x-custom-field'], 'anything');
  assert.equal(r.diagnostics.length, 0);
});

check('"unknown" and "n/a" normalize to null', () => {
  const r = parseCannabisTxt('Effective-Date: unknown\nContact: N/A\n');
  assert.equal(r.metadata['effective-date'], null);
  assert.equal(r.metadata['contact'], null);
});

check('record lists parse into arrays of objects', () => {
  const r = parseCannabisTxt(
    'Locations:\n- Location ID: a\n  Name: One\n\n- Location ID: b\n  Name: Two\n',
  );
  assert.deepEqual(r.lists['locations'], [
    { 'location-id': 'a', name: 'One' },
    { 'location-id': 'b', name: 'Two' },
  ]);
});

check('indented continuation extends the preceding field', () => {
  const r = parseCannabisTxt('Event detail URL pattern:\n  https://example.com/e/{slug}\n');
  assert.equal(r.metadata['event-detail-url-pattern'], 'https://example.com/e/{slug}');
});

check('Extensions block emits typed manifest entries', () => {
  const r = parseCannabisTxt('Extensions:\n- events: https://example.com/cannabis-events.txt\n');
  assert.deepEqual(r.extensions, [{ type: 'events', url: 'https://example.com/cannabis-events.txt' }]);
  assert.equal(r.lists['extensions'], undefined);
});

check('a prose sentence ending in a colon is not a field', () => {
  const r = parseCannabisTxt(
    'Version: 1.0.0\n\n======================================================================\n1. SCOPE\n\nCommon attributes include:\n\nA trailing paragraph.\n',
  );
  assert.equal(r.sections[0]?.fields['common-attributes-include'], undefined);
});

check('bare lists without an owning field remain prose', () => {
  const r = parseCannabisTxt(
    '1. PRINCIPLES\n\n- Open: anyone may publish.\n- Consistent: use defined names.\n',
  );
  assert.ok(r.sections[0]?.text.includes('- Open: anyone may publish.'));
  assert.equal(Object.keys(r.sections[0]?.lists ?? {}).length, 0);
});

check('missing required metadata caps conformance below level 2', () => {
  const r = parseCannabisTxt('Version: 1.0.0\n');
  assert.ok(conformance(r).level <= 1);
});

console.log(`\n${passed} checks passed${process.exitCode ? ' (with failures above)' : ''}.`);
