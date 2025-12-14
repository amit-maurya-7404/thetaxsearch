"use client"

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, Info, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-flex items-center ml-2 z-10">
    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-lavender-600 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-center pointer-events-none leading-relaxed font-normal">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

type FinancialYear = 'FY 2024-25' | 'FY 2025-26';
type AgeGroup = '0-60' | '60-80' | '80+';

const IncomeTax: React.FC = () => {
  // --- CONFIGURATION ---
  const [fy, setFy] = useState<FinancialYear>('FY 2024-25');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('0-60');

  // --- INCOME HEADS ---
  const [incomeSalary, setIncomeSalary] = useState<number>(1200000);
  const [incomeInterest, setIncomeInterest] = useState<number>(10000);
  const [incomeRental, setIncomeRental] = useState<number>(0); // Can be negative for SOP interest
  const [incomeOther, setIncomeOther] = useState<number>(0);

  // --- DEDUCTIONS (OLD REGIME MAINLY) ---
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [deductionsOther, setDeductionsOther] = useState<number>(0);

  // UI State
  const [showDeductions, setShowDeductions] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTax = () => {
    // -------------------------------------------------------------------------
    // 1. OLD REGIME CALCULATION
    // -------------------------------------------------------------------------
    
    // A. Gross Total Income (Old Regime)
    // House Property Loss set-off allowed up to 2 Lakhs against other heads
    let rentalIncomeOld = incomeRental;
    if (incomeRental < 0) {
        rentalIncomeOld = Math.max(incomeRental, -200000);
    }
    const grossIncomeOld = incomeSalary + incomeInterest + incomeOther + rentalIncomeOld;

    // B. Deductions
    const stdDedOld = incomeSalary > 0 ? 50000 : 0;
    
    // 80TTA / 80TTB
    let deductionInterest = 0;
    if (ageGroup === '0-60') {
        // 80TTA: Max 10k
        deductionInterest = Math.min(incomeInterest, 10000);
    } else {
        // 80TTB: Max 50k
        deductionInterest = Math.min(incomeInterest, 50000);
    }

    const totalDeductionsOld = 
        stdDedOld + 
        Math.min(deductions80C, 150000) + 
        deductions80D + 
        hraExemption + 
        deductionsOther + 
        deductionInterest;

    // C. Taxable Income
    const taxableOld = Math.max(0, Math.round((grossIncomeOld - totalDeductionsOld) / 10) * 10);

    // D. Tax Calculation
    let taxOld = 0;
    const slab1 = ageGroup === '0-60' ? 250000 : ageGroup === '60-80' ? 300000 : 500000;
    const slab2 = 500000;
    const slab3 = 1000000;

    if (taxableOld > slab3) {
        taxOld += (taxableOld - slab3) * 0.30;
        taxOld += (slab3 - slab2) * 0.20;
        if (slab2 > slab1) taxOld += (slab2 - slab1) * 0.05;
    } else if (taxableOld > slab2) {
        taxOld += (taxableOld - slab2) * 0.20;
        if (slab2 > slab1) taxOld += (slab2 - slab1) * 0.05;
    } else if (taxableOld > slab1) {
        taxOld += (taxableOld - slab1) * 0.05;
    }

    // Rebate 87A (Old Regime): Taxable <= 5L -> Tax = 0
    if (taxableOld <= 500000) {
        taxOld = 0;
    }

    // Cess 4%
    const cessOld = taxOld * 0.04;
    const finalTaxOld = Math.round(taxOld + cessOld);


    // -------------------------------------------------------------------------
    // 2. NEW REGIME CALCULATION
    // -------------------------------------------------------------------------
    
    // A. Gross Total Income (New Regime)
    // IMPORTANT: Loss from House Property (Self Occupied Interest) CANNOT be set off against Salary/Other heads.
    // It is carried forward (ignored for current year tax payable calculation).
    const rentalIncomeNew = Math.max(0, incomeRental);
    const grossIncomeNew = incomeSalary + incomeInterest + incomeOther + rentalIncomeNew;

    // B. Deductions
    // Standard Deduction increased to 75k for FY 24-25 and 25-26 (New Regime)
    const stdDedNew = incomeSalary > 0 ? 75000 : 0;
    
    // C. Taxable Income
    const taxableNew = Math.max(0, Math.round((grossIncomeNew - stdDedNew) / 10) * 10);

    let taxNew = 0;
    let rebateLimitNew = 0;

    if (fy === 'FY 2024-25') {
        // --- FY 2024-25 (New Regime) ---
        // Slabs: 0-3L (0), 3-7L (5), 7-10L (10), 10-12L (15), 12-15L (20), >15L (30)
        // Cumulative Tax:
        // 3L: 0
        // 7L: 20,000 (4L @ 5%)
        // 10L: 50,000 (3L @ 10% + 20k)
        // 12L: 80,000 (2L @ 15% + 50k)
        // 15L: 1,40,000 (3L @ 20% + 80k)
        
        rebateLimitNew = 700000;

        if (taxableNew > 1500000) {
            taxNew = 140000 + (taxableNew - 1500000) * 0.30;
        } else if (taxableNew > 1200000) {
            taxNew = 80000 + (taxableNew - 1200000) * 0.20;
        } else if (taxableNew > 1000000) {
            taxNew = 50000 + (taxableNew - 1000000) * 0.15;
        } else if (taxableNew > 700000) {
            taxNew = 20000 + (taxableNew - 700000) * 0.10;
        } else if (taxableNew > 300000) {
            taxNew = (taxableNew - 300000) * 0.05;
        }

    } else {
        // --- FY 2025-26 (New Regime) ---
        // Slabs: 0-4L (0), 4-8L (5), 8-12L (10), 12-16L (15), 16-20L (20), 20-24L (25), >24L (30)
        // Cumulative Tax:
        // 4L: 0
        // 8L: 20,000 (4L @ 5%)
        // 12L: 60,000 (4L @ 10% + 20k)
        // 16L: 1,20,000 (4L @ 15% + 60k)
        // 20L: 2,00,000 (4L @ 20% + 1.2L)
        // 24L: 3,00,000 (4L @ 25% + 2L)
        
        rebateLimitNew = 1200000;

        if (taxableNew > 2400000) {
            taxNew = 300000 + (taxableNew - 2400000) * 0.30;
        } else if (taxableNew > 2000000) {
            taxNew = 200000 + (taxableNew - 2000000) * 0.25;
        } else if (taxableNew > 1600000) {
            taxNew = 120000 + (taxableNew - 1600000) * 0.20;
        } else if (taxableNew > 1200000) {
            taxNew = 60000 + (taxableNew - 1200000) * 0.15;
        } else if (taxableNew > 800000) {
            taxNew = 20000 + (taxableNew - 800000) * 0.10;
        } else if (taxableNew > 400000) {
            taxNew = (taxableNew - 400000) * 0.05;
        }
    }

    // --- REBATE 87A & MARGINAL RELIEF (NEW REGIME) ---
    // Rule: If taxable income <= rebateLimit, Tax is 0.
    // Marginal Relief: If taxable income > rebateLimit, Tax payable should not exceed (Taxable Income - rebateLimit).
    
    if (taxableNew <= rebateLimitNew) {
        taxNew = 0;
    } else {
        const excessIncome = taxableNew - rebateLimitNew;
        // Check if calculated tax is greater than the income earned over the limit
        if (taxNew > excessIncome) {
            taxNew = excessIncome; // Restrict tax to the excess income amount
        }
    }

    const cessNew = taxNew * 0.04;
    const finalTaxNew = Math.round(taxNew + cessNew);

    return {
      old: finalTaxOld,
      new: finalTaxNew,
      taxableOld,
      taxableNew,
      stdDedOld,
      stdDedNew,
      totalDeductionsOld,
      grossNew: grossIncomeNew,
      grossOld: grossIncomeOld
    };
  };

  const results = calculateTax();
  const betterRegime = results.new < results.old ? 'New Regime' : results.new > results.old ? 'Old Regime' : 'Equal';
  const savings = Math.abs(results.new - results.old);

  return (
    <div id="income-tax" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: INPUTS */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* SECTION 1: SETTINGS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-lavender-100 p-2 rounded-xl text-lavender-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Financial Year</label>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                {(['FY 2024-25', 'FY 2025-26'] as FinancialYear[]).map((y) => (
                  <button
                    key={y}
                    onClick={() => setFy(y)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      fy === y ? 'bg-white text-lavender-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium appearance-none"
              >
                <option value="0-60">0 - 60 Years</option>
                <option value="60-80">60 - 80 Years</option>
                <option value="80+">80+ Years </option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: INCOME */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Income Sources <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Gross Values</span>
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                Income from Salary
                <Tooltip content="Gross Salary before any deductions. Standard Deduction (50k/75k) will be applied automatically." />
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                <input 
                  type="number" 
                  value={incomeSalary} 
                  onChange={(e) => setIncomeSalary(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Interest Income
                  <Tooltip content="Interest from Savings Bank, FD, etc. 80TTA/TTB deduction applied automatically in Old Regime." />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={incomeInterest} 
                    onChange={(e) => setIncomeInterest(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Other Income
                  <Tooltip content="Freelance, Dividend, Capital Gains (Short Term), etc." />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={incomeOther} 
                    onChange={(e) => setIncomeOther(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                Rental Income / Home Loan Interest
                <Tooltip content="Enter Net Rental Income. For Self-Occupied Home Loan Interest, enter negative value (e.g. -200000)." />
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                <input 
                  type="number" 
                  value={incomeRental} 
                  onChange={(e) => setIncomeRental(Number(e.target.value))}
                  placeholder="-200000 for Home Loan Interest"
                  className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 ml-1">
                *Enter negative value for Interest on Home Loan (Self Occupied). Max -2L deduction in Old Regime.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: DEDUCTIONS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button 
            onClick={() => setShowDeductions(!showDeductions)}
            className="w-full p-6 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
               <h3 className="text-lg font-bold text-slate-800">Deductions</h3>
               <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase">Old Regime Only</span>
            </div>
            {showDeductions ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </button>
          
          {showDeductions && (
            <div className="p-6 border-t border-slate-100 space-y-5 animate-fadeIn">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Section 80C
                  <Tooltip content="LIC, PPF, EPF, ELSS, Principal Repayment of Home Loan. Max 1.5 Lakhs." />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={deductions80C} 
                    onChange={(e) => setDeductions80C(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    Section 80D (Medical)
                    <Tooltip content="Health Insurance Premium for Self and Parents." />
                    </label>
                    <div className="relative">
                    <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                    <input 
                        type="number" 
                        value={deductions80D} 
                        onChange={(e) => setDeductions80D(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                    />
                    </div>
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                      HRA Exemption
                      <Tooltip content="Enter the calculated HRA Exemption amount (Min of: Actual HRA, Rent-10% Basic, 50% Basic)." />
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                      <input 
                        type="number" 
                        value={hraExemption} 
                        onChange={(e) => setHraExemption(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                      />
                    </div>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Other Deductions
                  <Tooltip content="Section 80E (Education Loan Interest), 80G (Donations), etc." />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={deductionsOther} 
                    onChange={(e) => setDeductionsOther(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: RESULTS */}
      <div className="xl:col-span-5 space-y-6">
        
        {/* RECOMMENDATION */}
        <div className="bg-gradient-to-br from-purple-600 via-lavender-600 to-purple-700 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">Recommendation</span>
              <CheckCircle className="w-6 h-6 text-lavender-200" />
            </div>
            <h2 className="text-3xl font-extrabold mb-2">{betterRegime}</h2>
            <p className="text-lavender-100 text-sm leading-relaxed opacity-90">
              {savings > 0 
                ? `You will save ${formatCurrency(savings)} by opting for the ${betterRegime}.` 
                : "Tax liability is identical in both regimes."}
            </p>
          </div>
        </div>

        {/* DETAILED CARDS */}
        <div className="space-y-4">
            
            {/* NEW REGIME CARD */}
            <div className={`p-6 rounded-2xl border transition-all relative overflow-hidden ${
              betterRegime === 'New Regime' 
              ? 'bg-gradient-to-br from-lavender-300 to-lavender-100 border-lavender-400 shadow-md ring-1 ring-lavender-300' 
              : 'bg-gradient-to-br from-lavender-100 to-white border-slate-100 opacity-95 hover:opacity-100'
            }`}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className="text-lavender-700 text-xs font-bold uppercase tracking-wider mb-1">New Regime</h4>
                        <span className="text-[10px] bg-lavender-50 text-lavender-600 px-2 py-0.5 rounded font-medium">{fy} Rules</span>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{formatCurrency(results.new)}</p>
                        <p className="text-[10px] text-slate-400">Total Tax Payable</p>
                    </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-slate-50 text-xs">
                    <div className="flex justify-between text-slate-500">
                        <span>Gross Income</span>
                        <span className="font-medium text-slate-700">{formatCurrency(results.grossNew)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>Standard Deduction</span>
                        <span className="font-medium text-slate-700">{formatCurrency(results.stdDedNew)}</span>
                    </div>
                    <div className="flex justify-between text-slate-800 font-bold pt-1 border-t border-slate-100 mt-1">
                        <span>Net Taxable Income</span>
                        <span>{formatCurrency(results.taxableNew)}</span>
                    </div>
                    {(results.new === 0 && results.taxableNew > 0) && (
                        <div className="mt-2 bg-green-50 text-green-700 p-2 rounded text-center font-medium">
                            Zero Tax (Rebate 87A Applied)
                        </div>
                    )}
                </div>
            </div>

            {/* OLD REGIME CARD */}
            <div className={`p-6 rounded-2xl border transition-all relative overflow-hidden ${
              betterRegime === 'Old Regime' 
              ? 'bg-gradient-to-br from-lavender-300 to-lavender-100 border-lavender-400 shadow-md ring-1 ring-lavender-300' 
              : 'bg-gradient-to-br from-lavender-100 to-white border-slate-100 opacity-95 hover:opacity-100'
            }`}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Old Regime</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">{ageGroup} Slabs</span>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{formatCurrency(results.old)}</p>
                        <p className="text-[10px] text-slate-400">Total Tax Payable</p>
                    </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-slate-50 text-xs">
                    <div className="flex justify-between text-slate-500">
                        <span>Gross Income</span>
                        <span className="font-medium text-slate-700">{formatCurrency(results.grossOld)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>Total Deductions</span>
                        <span className="font-medium text-slate-700">{formatCurrency(results.totalDeductionsOld)}</span>
                    </div>
                    <div className="flex justify-between text-slate-800 font-bold pt-1 border-t border-slate-100 mt-1">
                        <span>Net Taxable Income</span>
                        <span>{formatCurrency(results.taxableOld)}</span>
                    </div>
                </div>
            </div>

        </div>

        {/* INFO BOX */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
             <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
             <div className="text-xs text-blue-700 leading-relaxed">
                <p><strong>Logic Explained:</strong></p>
                <ul className="list-disc ml-4 space-y-1 mt-1">
                    <li><strong>Standard Deduction:</strong> ₹75,000 for New Regime (Both FYs) vs ₹50,000 for Old Regime.</li>
                    <li><strong>Rebate 87A:</strong> New Regime tax is zero for income up to ₹7L (FY 24-25) and ₹12L (FY 25-26). Marginal Relief is applied if income slightly exceeds these limits.</li>
                    <li><strong>House Property Loss:</strong> Cannot be set off against Salary in New Regime.</li>
                </ul>
             </div>
        </div>

      </div>
    </div>
  );
};

export default IncomeTax;
