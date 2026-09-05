/**
 * ACF choice label maps, transcribed from `acf-json/group_service.json`.
 *
 * Stored values are snake_case keys; these are the labels ACF shows in
 * wp-admin. Kept in one place so a component never invents its own wording.
 */

export const PACKAGE_TIER_LABELS = {
  basic: 'Basic',
  standard: 'Standard',
  premium: 'Premium',
  ultimate: 'Ultimate',
} as const;

export const VEHICLE_SIZE_LABELS = {
  small: 'Small (City Car)',
  medium: 'Medium (Sedan/SUV)',
  large: 'Large (Large SUV)',
  xlarge: 'X-Large (MPV)',
  super: 'Super (Luxury)',
} as const;

export const SERVICE_CATEGORY_LABELS = {
  coating: 'Coating',
  protection: 'Protection',
  detailing: 'Detailing',
  wash: 'Wash',
  other: 'Other',
} as const;

export const GALLERY_TYPE_LABELS = {
  before: 'Before Image',
  after: 'After Image',
  process: 'Process Image',
  general: 'General',
} as const;

/** Canonical display order for vehicle sizes; ACF stores no ordering. */
export const VEHICLE_SIZE_ORDER = [
  'small',
  'medium',
  'large',
  'xlarge',
  'super',
] as const;

/** Canonical display order for package tiers. */
export const PACKAGE_TIER_ORDER = [
  'basic',
  'standard',
  'premium',
  'ultimate',
] as const;
