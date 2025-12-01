export const TAX_SLABS_NEW_REGIME = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 0.05 },
  { min: 600000, max: 900000, rate: 0.1 },
  { min: 900000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.2 },
  { min: 1500000, max: Infinity, rate: 0.3 },
]

export const TAX_SLABS_OLD_REGIME = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.2 },
  { min: 1000000, max: Infinity, rate: 0.3 },
]

export const GST_RATES = [0, 5, 12, 18, 28]

export const HRA_PERCENTAGES: { [key: string]: number } = {
  metro: 0.5,
  tier1: 0.4,
  others: 0.25,
}

export const TDS_SECTIONS: { [key: string]: number } = {
  "194C": 1, // Contractor/Professional
  "194D": 5, // Insurance Commission
  "194H": 5, // Commission on Sale of Lottery
  "194I": 5, // Rent
  "194J": 10, // Professional Fees
  "194LA": 5, // Sale of Property
  "194O": 1, // Cash withdrawal
}

export function calculateIncomeTax(
  taxableIncome: number,
  regime: "new" | "old"
): { tax: number; cess: number; totalTax: number } {
  const slabs = regime === "new" ? TAX_SLABS_NEW_REGIME : TAX_SLABS_OLD_REGIME
  let tax = 0

  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const incomeInSlab = Math.min(taxableIncome, slab.max) - slab.min
      tax += incomeInSlab * slab.rate
    } else {
      break
    }
  }

  const cess = tax * 0.04
  return {
    tax: Math.round(tax),
    cess: Math.round(cess),
    totalTax: Math.round(tax + cess),
  }
}

export function calculateHRA(
  basicSalary: number,
  rentPaid: number,
  cityCategory: "metro" | "tier1" | "others"
): number {
  const percentage = HRA_PERCENTAGES[cityCategory]
  const hraAllowance = basicSalary * percentage
  const rentAfterBasic = Math.max(0, rentPaid - basicSalary * 0.1)

  return Math.min(hraAllowance, rentAfterBasic)
}

export function calculateGST(
  baseAmount: number,
  gstRate: number
): { gst: number; total: number } {
  const gst = (baseAmount * gstRate) / 100
  return {
    gst: Math.round(gst * 100) / 100,
    total: Math.round((baseAmount + gst) * 100) / 100,
  }
}

export function calculateTDS(
  amount: number,
  tdsRate: number
): { tds: number; net: number } {
  const tds = (amount * tdsRate) / 100
  return {
    tds: Math.round(tds * 100) / 100,
    net: Math.round((amount - tds) * 100) / 100,
  }
}
