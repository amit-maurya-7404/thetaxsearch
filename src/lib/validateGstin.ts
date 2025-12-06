export function isValidGstin(gstin: string) {
  // GSTIN is 15 chars: 2 digits (state code) + 10 PAN chars + 1 entity code + 1 Z + 1 checksum
  // Basic regex validation (does not verify checksum):
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i
  return re.test(gstin.trim()) && gstin.trim().length === 15
}

export default isValidGstin
