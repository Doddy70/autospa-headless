/**
 * Safe field normalization - the single place where GraphQL's three-valued
 * reality is collapsed into something the UI can trust.
 *
 * A field can be:
 *   ok          - resolved, non-empty, safe to render
 *   empty       - resolved but null / [] / "" - business data not entered yet
 *   unavailable - the resolver threw; GraphQL returned null plus an error entry
 *
 * The UI treats `empty` and `unavailable` identically (hide the section). They
 * are kept distinct anyway because only `unavailable` indicates a backend
 * defect worth logging, and conflating them would hide a regression.
 *
 * Components never call these helpers - repositories do. Phase 1C section 5.2.
 */

export type FieldStatus = 'ok' | 'empty' | 'unavailable';

export interface FieldState<T> {
  status: FieldStatus;
  value: T | null;
}

export const UNAVAILABLE: FieldState<never> = { status: 'unavailable', value: null };
export const EMPTY: FieldState<never> = { status: 'empty', value: null };

export function present<T>(value: T): FieldState<T> {
  return { status: 'ok', value };
}

/** Render gate. `state.value` is non-null inside the guard. */
export function isPresent<T>(
  state: FieldState<T>,
): state is { status: 'ok'; value: T } {
  return state.status === 'ok' && state.value !== null;
}

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Build a FieldState from a raw GraphQL value.
 *
 * @param raw          the value as it came off the wire
 * @param path         dotted GraphQL path, matched against the error set
 * @param unavailable  paths whose resolver failed, from `wpQuery`
 * @param transform    optional shaper; returning null/[]/"" downgrades to empty
 */
export function toField<TRaw, TOut = TRaw>(
  raw: TRaw,
  path: string,
  unavailable: Set<string>,
  transform?: (value: NonNullable<TRaw>) => TOut | null,
): FieldState<TOut> {
  if (unavailable.has(path)) return UNAVAILABLE;
  if (isBlank(raw)) return EMPTY;

  const shaped = transform
    ? transform(raw as NonNullable<TRaw>)
    : (raw as unknown as TOut);

  return isBlank(shaped) ? EMPTY : present(shaped as TOut);
}

/** Trimmed string, or null when absent/blank. */
export function asText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Always an array, never null - safe to `.map()` unconditionally. */
export function asArray<T>(value: readonly T[] | null | undefined): T[] {
  return Array.isArray(value) ? value.filter((item) => item != null) : [];
}

export function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * ACF `select` fields resolve as arrays even when single-valued
 * (`serviceCategory: ["coating"]`). Take the first entry.
 */
export function asChoice(value: unknown): string | null {
  if (Array.isArray(value)) return asText(value[0]);
  return asText(value);
}

/** Map a stored choice value to its human label, falling back to the value. */
export function choiceLabel(
  map: Readonly<Record<string, string>>,
  value: string | null,
): string | null {
  if (!value) return null;
  return map[value] ?? value;
}

/** `"a jakarta;b jakarta"` -> `["a jakarta", "b jakarta"]`. */
export function splitKeywords(value: unknown): string[] {
  const text = asText(value);
  if (!text) return [];
  return text
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

const IDR = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function formatIDR(value: number | null): string | null {
  return value === null ? null : IDR.format(value);
}
