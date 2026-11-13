/** Decode a category path value once and return a clean label for the UI. */
export function formatCategoryName(value: string | null | undefined): string {
  const rawValue = (value ?? '').trim();
  if (!rawValue) return '';

  let decodedValue = rawValue;
  if (/%[\da-f]{2}/i.test(rawValue)) {
    try {
      decodedValue = decodeURIComponent(rawValue);
    } catch {
      // Keep malformed escapes visible instead of throwing during rendering.
    }
  }

  return decodedValue.replace(/\s+/g, ' ').trim();
}

/** Keep path segments encoded while using the same normalization as labels. */
export function encodeCategorySlug(value: string): string {
  return encodeURIComponent(formatCategoryName(value));
}
