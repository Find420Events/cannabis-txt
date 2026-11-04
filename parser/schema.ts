/**
 * Minimal JSON Schema validator covering the subset used by schemas/:
 * type, enum, const, required, properties, additionalProperties, items,
 * pattern, minimum, $ref (#/$defs/...), allOf, and if/then.
 *
 * Zero dependencies — sufficient for conformance fixtures, not a general
 * JSON Schema implementation.
 */

type Schema = Record<string, unknown> | boolean;

const TYPE_CHECKS: Record<string, (v: unknown) => boolean> = {
  string: (v) => typeof v === 'string',
  number: (v) => typeof v === 'number',
  integer: (v) => typeof v === 'number' && Number.isInteger(v),
  object: (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
  array: (v) => Array.isArray(v),
  boolean: (v) => typeof v === 'boolean',
  null: (v) => v === null,
};

const resolveRef = (ref: string, root: Record<string, unknown>): Schema => {
  if (!ref.startsWith('#/')) return true; // external refs unsupported; skip
  let node: unknown = root;
  for (const part of ref.slice(2).split('/')) {
    if (typeof node !== 'object' || node === null || !(part in node)) return true;
    node = (node as Record<string, unknown>)[part];
  }
  return node as Schema;
};

const typeName = (v: unknown): string =>
  v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v;

export const validateJson = (
  value: unknown,
  schema: Schema,
  root?: Schema,
  path = '$',
): string[] => {
  const errors: string[] = [];
  if (typeof schema === 'boolean') return schema ? [] : [`${path}: not allowed`];
  const r = (root ?? schema) as Record<string, unknown>;

  if (typeof schema.$ref === 'string') {
    return validateJson(value, resolveRef(schema.$ref, r), r, path);
  }

  if (Array.isArray(schema.type)) {
    const types = schema.type as string[];
    if (!types.some((t) => TYPE_CHECKS[t]?.(value))) {
      errors.push(`${path}: expected ${types.join('|')}, got ${typeName(value)}`);
      return errors;
    }
  } else if (typeof schema.type === 'string' && !TYPE_CHECKS[schema.type as string]?.(value)) {
    errors.push(`${path}: expected ${schema.type}, got ${typeName(value)}`);
    return errors;
  }

  if (schema.enum !== undefined) {
    const allowed = schema.enum as unknown[];
    if (!allowed.some((a) => JSON.stringify(a) === JSON.stringify(value))) {
      errors.push(`${path}: ${JSON.stringify(value)} is not one of ${JSON.stringify(allowed)}`);
    }
  }
  if (schema.const !== undefined && JSON.stringify(schema.const) !== JSON.stringify(value)) {
    errors.push(`${path}: expected ${JSON.stringify(schema.const)}`);
  }
  if (typeof schema.pattern === 'string' && typeof value === 'string') {
    if (!new RegExp(schema.pattern).test(value)) {
      errors.push(`${path}: "${value}" does not match /${schema.pattern}/`);
    }
  }
  if (typeof schema.minimum === 'number' && typeof value === 'number' && value < schema.minimum) {
    errors.push(`${path}: ${value} < minimum ${schema.minimum}`);
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const props = (schema.properties ?? {}) as Record<string, Schema>;
    for (const key of (schema.required ?? []) as string[]) {
      if (!(key in obj)) errors.push(`${path}: missing required property "${key}"`);
    }
    for (const [key, sub] of Object.entries(props)) {
      if (key in obj) errors.push(...validateJson(obj[key], sub, r, `${path}.${key}`));
    }
    const extra = Object.keys(obj).filter((k) => !(k in props));
    if (schema.additionalProperties === false) {
      for (const key of extra) errors.push(`${path}: unexpected property "${key}"`);
    } else if (typeof schema.additionalProperties === 'object') {
      for (const key of extra) {
        errors.push(...validateJson(obj[key], schema.additionalProperties, r, `${path}.${key}`));
      }
    }
  }

  if (Array.isArray(value) && schema.items !== undefined) {
    value.forEach((item, i) => {
      errors.push(...validateJson(item, schema.items as Schema, r, `${path}[${i}]`));
    });
  }

  for (const sub of (schema.allOf ?? []) as Schema[]) {
    errors.push(...validateJson(value, sub, r, path));
  }
  if (schema.if !== undefined) {
    const cond = validateJson(value, schema.if as Schema, r, path).length === 0;
    const branch = cond ? schema.then : schema.else;
    if (branch !== undefined) errors.push(...validateJson(value, branch as Schema, r, path));
  }

  return errors;
};
