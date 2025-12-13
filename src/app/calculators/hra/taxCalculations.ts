import { AgeGroup, DeductionDetails, IncomeDetails, TaxResult, ComparisonResult, FinancialYear } from './types';

const STANDARD_DEDUCTION_OLD = 50000;
const STANDARD_DEDUCTION_NEW_24_25 = 75000;
const STANDARD_DEDUCTION_NEW_25_26 = 75000;
const CESS_RATE = 0.04;

const roundToNearest10 = (num: number) => Math.round(num / 10) * 10;

export const calculateHRAExemption = (
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean
): number => {
  if (rentPaid <= 0 || hraReceived <= 0) return 0;
  const condition1 = hraReceived;
  const condition2 = basicSalary * (isMetro ? 0.5 : 0.4);
  const condition3 = Math.max(0, rentPaid - (basicSalary * 0.1));

  return Math.min(condition1, condition2, condition3);
};

// The rest of the file (income tax calculators) is preserved for completeness
const getSurchargeRateOld = (taxableIncome: number): number => {
  if (taxableIncome > 50000000) return 0.37;
  if (taxableIncome > 20000000) return 0.25;
  if (taxableIncome > 10000000) return 0.15;
  if (taxableIncome > 5000000) return 0.10;
  return 0;
};

const getSurchargeRateNew = (taxableIncome: number): number => {
  if (taxableIncome > 20000000) return 0.25;
  if (taxableIncome > 10000000) return 0.15;
  if (taxableIncome > 5000000) return 0.10;
  return 0;
};

const calculateIncomeTax = (taxableIncome: number, regime: 'Old' | 'New', age: AgeGroup, year: FinancialYear): { tax: number, slabs: any[] } => {
  let tax = 0;
  const slabs: any[] = [];
  let remainingIncome = taxableIncome;
  let slabStart = 0;

  if (regime === 'Old') {
    let basicExemptionLimit = 250000;
    if (age === AgeGroup.BETWEEN_60_80) basicExemptionLimit = 300000;
    if (age === AgeGroup.ABOVE_80) basicExemptionLimit = 500000;

    let slabAmount = Math.min(remainingIncome, basicExemptionLimit);
    slabs.push({ label: `0 - ${basicExemptionLimit/1000}k`, amount: slabAmount, rate: 0, tax: 0 });
    remainingIncome -= slabAmount;
    slabStart = basicExemptionLimit;

    if (remainingIncome > 0 && slabStart < 500000) {
      const range = 500000 - slabStart;
      slabAmount = Math.min(remainingIncome, range);
      const taxAmt = slabAmount * 0.05;
      slabs.push({ label: `${slabStart/1000}k - 5L`, amount: slabAmount, rate: 5, tax: taxAmt });
      tax += taxAmt;
      remainingIncome -= slabAmount;
      slabStart = 500000;
    }

    if (remainingIncome > 0 && slabStart < 1000000) {
      const range = 1000000 - slabStart;
      slabAmount = Math.min(remainingIncome, range);
      const taxAmt = slabAmount * 0.20;
      slabs.push({ label: `5L - 10L`, amount: slabAmount, rate: 20, tax: taxAmt });
      tax += taxAmt;
      remainingIncome -= slabAmount;
      slabStart = 1000000;
    }

    if (remainingIncome > 0) {
      const taxAmt = remainingIncome * 0.30;
      slabs.push({ label: `> 10L`, amount: remainingIncome, rate: 30, tax: taxAmt });
      tax += taxAmt;
    }
  } else {
    let newSlabs: { limit: number; rate: number; label: string }[] = [];

    if (year === 'FY 2024-25') {
      newSlabs = [
        { limit: 300000, rate: 0, label: '0 - 3L' },
        { limit: 700000, rate: 0.05, label: '3L - 7L' },
        { limit: 1000000, rate: 0.10, label: '7L - 10L' },
        { limit: 1200000, rate: 0.15, label: '10L - 12L' },
        { limit: 1500000, rate: 0.20, label: '12L - 15L' },
        { limit: Infinity, rate: 0.30, label: '> 15L' },
      ];
    } else {
      newSlabs = [
        { limit: 400000, rate: 0, label: '0 - 4L' },
        { limit: 800000, rate: 0.05, label: '4L - 8L' },
        { limit: 1200000, rate: 0.10, label: '8L - 12L' },
        { limit: 1600000, rate: 0.15, label: '12L - 16L' },
        { limit: 2000000, rate: 0.20, label: '16L - 20L' },
        { limit: 2400000, rate: 0.25, label: '20L - 24L' },
        { limit: Infinity, rate: 0.30, label: '> 24L' },
      ];
    }

    let currentLimit = 0;
    for (const slab of newSlabs) {
        if (remainingIncome <= 0) break;
        
        const range = slab.limit === Infinity ? remainingIncome : slab.limit - currentLimit;
        const slabAmount = Math.min(remainingIncome, range);
        
        if (slabAmount > 0) {
            const taxAmt = slabAmount * slab.rate;
            slabs.push({ label: slab.label, amount: slabAmount, rate: slab.rate * 100, tax: taxAmt });
            tax += taxAmt;
            remainingIncome -= slabAmount;
        }
        currentLimit = slab.limit;
    }
  }

  return { tax, slabs };
};

export const calculateTaxOldRegime = (
  income: IncomeDetails,
  deductions: DeductionDetails,
  age: AgeGroup,
  year: FinancialYear
): TaxResult => {
  const grossSalary = income.grossSalary;
  const stdDeduction = grossSalary > 0 ? Math.min(grossSalary, STANDARD_DEDUCTION_OLD) : 0;
  
  const hraExemption = calculateHRAExemption(
    deductions.basicSalaryForHRA || (grossSalary * 0.5),
    deductions.hraReceived,
    deductions.rentPaid,
    deductions.isMetroCity
  );
  const ltaExemption = deductions.lta;
  
  const incomeFromSalary = Math.max(0, grossSalary - hraExemption - ltaExemption - stdDeduction);

  const otherSources = income.incomeFromInterest + income.otherIncome;
  const houseProperty = income.rentalIncome;

  const grossTotalIncome = Math.max(0, incomeFromSalary + otherSources + houseProperty);

  let total80C = Math.min(150000, deductions.basicSection80C);
  let total80D = deductions.medicalInsurance80D; 
  let total80CCD = Math.min(50000, deductions.nps80CCD1B);
  
  let deduction80TTA_TTB = 0;
  if (income.incomeFromInterest > 0) {
      if (age === AgeGroup.BELOW_60) {
          deduction80TTA_TTB = Math.min(income.incomeFromInterest, 10000);
      } else {
          deduction80TTA_TTB = Math.min(income.incomeFromInterest, 50000);
      }
  }

  const otherDed = deductions.otherDeductions;
  
  const totalDeductions = total80C + total80D + total80CCD + otherDed + deduction80TTA_TTB;
  
  const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions);

  const { tax, slabs } = calculateIncomeTax(taxableIncome, 'Old', age, year);
  
  let rebate87A = 0;
  if (taxableIncome <= 500000) {
      rebate87A = Math.min(tax, 12500);
  }
  
  let taxAfterRebate = tax - rebate87A;

  let surcharge = 0;
  const surchargeRate = getSurchargeRateOld(taxableIncome);
  
  if (surchargeRate > 0) {
      surcharge = taxAfterRebate * surchargeRate;
      
      let threshold = 5000000;
      if (taxableIncome > 50000000) threshold = 50000000;
      else if (taxableIncome > 20000000) threshold = 20000000;
      else if (taxableIncome > 10000000) threshold = 10000000;
      
      const { tax: taxAtThreshold } = calculateIncomeTax(threshold, 'Old', age, year);
      
      let prevSurRate = 0;
      if (threshold === 10000000) prevSurRate = 0.10;
      if (threshold === 20000000) prevSurRate = 0.15;
      if (threshold === 50000000) prevSurRate = 0.25;

      const surchargeAtThreshold = taxAtThreshold * prevSurRate;
      const totalTaxAtThreshold = taxAtThreshold + surchargeAtThreshold;
      
      const incomeExcess = taxableIncome - threshold;
      const totalTaxCurrently = taxAfterRebate + surcharge;
      
      if (totalTaxCurrently > (totalTaxAtThreshold + incomeExcess)) {
          const newTotalTax = totalTaxAtThreshold + incomeExcess;
          surcharge = newTotalTax - taxAfterRebate;
          if (surcharge < 0) surcharge = 0; 
      }
  }

  const totalTaxBeforeCess = taxAfterRebate + surcharge;
  const cess = totalTaxBeforeCess * CESS_RATE;
  const totalTax = roundToNearest10(totalTaxBeforeCess + cess);

  return {
    taxableIncome,
    taxOnIncome: tax,
    rebate87A,
    surcharge,
    cess,
    totalTax,
    regime: 'Old',
    breakdown: {
      slabs,
      deductionsTotal: totalDeductions + hraExemption + ltaExemption + stdDeduction
    }
  };
};

export const calculateTaxNewRegime = (
  income: IncomeDetails,
  year: FinancialYear
): TaxResult => {
  const grossSalary = income.grossSalary;
  const standardDeductionAmount = year === 'FY 2025-26' ? STANDARD_DEDUCTION_NEW_25_26 : STANDARD_DEDUCTION_NEW_24_25;
  
  const stdDeduction = grossSalary > 0 ? Math.min(grossSalary, standardDeductionAmount) : 0;
  
  const incomeFromSalary = Math.max(0, grossSalary - stdDeduction);
  
  const otherSources = income.incomeFromInterest + income.otherIncome;
  const houseProperty = income.rentalIncome;
  
  const grossTotalIncome = Math.max(0, incomeFromSalary + otherSources + houseProperty);
  
  const taxableIncome = grossTotalIncome;

  const { tax, slabs } = calculateIncomeTax(taxableIncome, 'New', AgeGroup.BELOW_60, year);

  let rebate87A = 0;
  let taxAfterRebate = tax;

  let rebateLimitIncome = 700000;
  if (year === 'FY 2025-26') rebateLimitIncome = 1200000;

  if (taxableIncome <= rebateLimitIncome) {
      rebate87A = tax;
      taxAfterRebate = 0;
  } else {
      const incomeExcess = taxableIncome - rebateLimitIncome;
      if (tax > incomeExcess) {
          const relief = tax - incomeExcess;
          rebate87A = relief;
          taxAfterRebate = tax - rebate87A;
      }
  }

  let surcharge = 0;
  const surchargeRate = getSurchargeRateNew(taxableIncome);

  if (surchargeRate > 0) {
      surcharge = taxAfterRebate * surchargeRate;

      let threshold = 5000000;
      if (taxableIncome > 20000000) threshold = 20000000;
      else if (taxableIncome > 10000000) threshold = 10000000;
      
      const { tax: taxAtThreshold } = calculateIncomeTax(threshold, 'New', AgeGroup.BELOW_60, year);
      
      let prevSurRate = 0;
      if (threshold === 10000000) prevSurRate = 0.10;
      if (threshold === 20000000) prevSurRate = 0.15;
      
      const surchargeAtThreshold = taxAtThreshold * prevSurRate;
      const totalTaxAtThreshold = taxAtThreshold + surchargeAtThreshold;
      
      const incomeExcess = taxableIncome - threshold;
      const totalTaxCurrently = taxAfterRebate + surcharge;
      
      if (totalTaxCurrently > (totalTaxAtThreshold + incomeExcess)) {
           const newTotalTax = totalTaxAtThreshold + incomeExcess;
           surcharge = newTotalTax - taxAfterRebate;
           if (surcharge < 0) surcharge = 0;
      }
  }

  const totalTaxBeforeCess = taxAfterRebate + surcharge;
  const cess = totalTaxBeforeCess * CESS_RATE;
  const totalTax = roundToNearest10(totalTaxBeforeCess + cess);

  return {
    taxableIncome,
    taxOnIncome: tax,
    rebate87A,
    surcharge,
    cess,
    totalTax,
    regime: 'New',
    breakdown: {
      slabs,
      deductionsTotal: stdDeduction
    }
  };
};

export const compareRegimes = (
  income: IncomeDetails,
  deductions: DeductionDetails,
  age: AgeGroup,
  year: FinancialYear
): ComparisonResult => {
  const oldRegime = calculateTaxOldRegime(income, deductions, age, year);
  const newRegime = calculateTaxNewRegime(income, year);

  const recommended = oldRegime.totalTax < newRegime.totalTax ? 'Old' : 'New';
  const savings = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  return {
    financialYear: year,
    oldRegime,
    newRegime,
    recommended,
    savings
  };
};
