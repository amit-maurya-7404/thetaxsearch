export type FinancialYear = 'FY 2024-25' | 'FY 2025-26';

export enum AgeGroup {
  BELOW_60 = 'Below 60',
  BETWEEN_60_80 = '60 to 80',
  ABOVE_80 = 'Above 80',
}

export interface IncomeDetails {
  grossSalary: number;
  incomeFromInterest: number;
  rentalIncome: number;
  otherIncome: number;
}

export interface DeductionDetails {
  basicSection80C: number;
  medicalInsurance80D: number;
  hraReceived: number;
  rentPaid: number;
  isMetroCity: boolean;
  basicSalaryForHRA: number;
  lta: number;
  otherDeductions: number;
  nps80CCD1B: number;
}

export interface TaxResult {
  taxableIncome: number;
  taxOnIncome: number;
  rebate87A: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  regime: 'Old' | 'New';
  breakdown: {
    slabs: { label: string; amount: number; rate: number; tax: number }[];
    deductionsTotal: number;
  };
}

export interface ComparisonResult {
  financialYear: FinancialYear;
  oldRegime: TaxResult;
  newRegime: TaxResult;
  recommended: 'Old' | 'New';
  savings: number;
}
