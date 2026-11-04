# cannabis-txt reference parser

A zero-dependency TypeScript reference implementation of
[`specification/grammar.md`](../specification/grammar.md). It parses any file
in the cannabis.txt family into the canonical JSON output model and reports
conformance levels 0–3.

Requires Node.js ≥ 23 (native TypeScript type stripping) — no build step and
no dependencies.

## Validate a file

```
node parser/cli.ts <path-or-url>
node parser/cli.ts https://find420.events/cannabis.txt
node parser/cli.ts examples/find420/cannabis.txt --json
```

Exit code is `0` at conformance level 2 or higher, `1` below.

## Library use

```ts
import { parseCannabisTxt, conformance } from './parser/parse.ts';

const result = parseCannabisTxt(fileContent);
const { level, diagnostics } = conformance(result);
// result -> canonical JSON model (specification, metadata, extensions,
//           sections, lists, diagnostics)
```

## Tests and fixtures

```
npm test
```

Runs the golden fixture (`fixtures/basic.txt` ↔ `fixtures/basic.expected.json`),
parses every specification document and example in the repository, and checks
grammar-level behaviors: canonical keys, duplicates, unknown fields, `unknown`
→ `null` normalization, record lists, continuations, and `Extensions` blocks.
