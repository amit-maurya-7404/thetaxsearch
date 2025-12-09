"use client"

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, Info, HelpCircle } from 'lucide-react';

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-flex items-center ml-2">
    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-lavender-600 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none leading-relaxed font-normal">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const IncomeTax: React.FC = () => {
  const [income, setIncome] = useState<number | null>(null);
  const [deductions80C, setDeductions80C] = useState<number | null>(null);
  const [hraExemption, setHraExemption] = useState<number | null>(null);
  const [otherDeductions, setOtherDeductions] = useState<number | null>(null);
  const [isSalaried, setIsSalaried] = useState<boolean>(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTax = () => {
    if (income === null || deductions80C === null || hraExemption === null || otherDeductions === null) {
      return null;
    }

    const stdDedOld = isSalaried ? 50000 : 0;
    const taxableOld = Math.max(0, income - stdDedOld - deductions80C - hraExemption - otherDeductions);
    
    let taxOld = 0;
    if (taxableOld > 1000000) {
      taxOld += (taxableOld - 1000000) * 0.30 + 112500;
    } else if (taxableOld > 500000) {
      taxOld += (taxableOld - 500000) * 0.20 + 12500;
    } else if (taxableOld > 250000) {
      taxOld += (taxableOld - 250000) * 0.05;
    }

    if (taxableOld <= 500000) taxOld = 0;
    
    const cessOld = taxOld * 0.04;
    const totalTaxOld = Math.round(taxOld + cessOld);

    const stdDedNew = isSalaried ? 75000 : 0;
    const taxableNew = Math.max(0, income - stdDedNew);
    
    let taxNew = 0;
    
    if (taxableNew > 1500000) {
        taxNew = (taxableNew - 1500000) * 0.30 + 140000;
    } else if (taxableNew > 1200000) {
        taxNew = (taxableNew - 1200000) * 0.20 + 80000;
    } else if (taxableNew > 1000000) {
        taxNew = (taxableNew - 1000000) * 0.15 + 50000;
    } else if (taxableNew > 700000) {
        taxNew = (taxableNew - 700000) * 0.10 + 20000;
    } else if (taxableNew > 300000) {
        taxNew = (taxableNew - 300000) * 0.05;
    }

    if (taxableNew <= 1200000) {
        taxNew = 0;
    } else {
        const excessIncome = taxableNew - 1200000;
        if (taxNew > excessIncome) {
            taxNew = excessIncome;
        }
    }

    const cessNew = taxNew * 0.04;
    const totalTaxNew = Math.round(taxNew + cessNew);

    return {
      old: totalTaxOld,
      new: totalTaxNew,
      taxableOld: taxableOld,
      taxableNew: taxableNew,
      stdDedNew,
      stdDedOld
    };
  };

  const results = calculateTax();
  const betterRegime = results ? (results.new < results.old ? 'New Regime' : results.new > results.old ? 'Old Regime' : 'Both are equal') : '';
  const savings = results ? Math.abs(results.new - results.old) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
        <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
          <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Income Details</h3>
            <p className="text-xs text-slate-500">FY 2025-26 (AY 2026-27)</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
             <label className="text-sm font-semibold text-slate-700 flex items-center">
               Employment Type
               <Tooltip content="Salaried individuals get Standard Deduction benefits (₹75k New, ₹50k Old)." />
             </label>
             <div className="flex bg-white rounded-lg p-1 border border-purple-200 shadow-sm">
                <button 
                  onClick={() => setIsSalaried(true)}
                  className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${isSalaried ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Salaried
                </button>
                <button 
                  onClick={() => setIsSalaried(false)}
                  className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${!isSalaried ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Other
                </button>
             </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
              Gross Annual Income
              <Tooltip content="Total income from Salary, Business, House Property, and other sources before any deductions." />
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
              <input 
                type="number" 
                value={income ?? ''} 
                onChange={(e) => setIncome(e.target.value === '' ? null : Number(e.target.value))}
                placeholder="Enter gross income"
                className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Deductions (Old Regime Only)</h4>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Section 80C
                  <Tooltip content="Investment in PPF, EPF, LIC, ELSS Mutual Funds, etc. Maximum limit is ₹1.5 Lakhs." />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={deductions80C ?? ''} 
                    onChange={(e) => setDeductions80C(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="Enter deductions"
                    className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    HRA Exemption
                    <Tooltip content="House Rent Allowance exemption based on actual rent paid vs salary components." />
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={hraExemption ?? ''} 
                    onChange={(e) => setHraExemption(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="Enter HRA exemption"
                    className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    Other (80D, 80E)
                    <Tooltip content="Deductions for Medical Insurance (80D), Education Loan Interest (80E), Donations (80G), etc." />
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={otherDeductions ?? ''} 
                    onChange={(e) => setOtherDeductions(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="Enter other deductions"
                    className="w-full pl-8 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results ? (
      <div className="space-y-6">
        {/* Recommendation Card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Recommendation</span>
              <CheckCircle className="w-8 h-8 text-purple-200" />
            </div>
            <h2 className="text-4xl font-extrabold mt-2 mb-1">{betterRegime}</h2>
            {savings > 0 ? (
                <p className="text-purple-100 text-lg">
                You save <span className="font-bold text-white bg-white/10 px-2 rounded">{formatCurrency(savings)}</span> with this choice.
                </p>
            ) : (
                <p className="text-purple-100">Tax liability is identical in both regimes.</p>
            )}
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Old Regime Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Old Regime</h4>
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-6 group-hover:text-purple-700 transition-colors">{formatCurrency(results.old)}</p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 flex justify-between">
                <span>Taxable Income</span>
                <span className="font-medium text-slate-700">{formatCurrency(results.taxableOld)}</span>
              </div>
              <div className="text-xs text-slate-500 flex justify-between">
                <span>Total Deductions</span>
                <span className="font-medium text-slate-700">{formatCurrency(results.stdDedOld + (deductions80C || 0) + (hraExemption || 0) + (otherDeductions || 0))}</span>
              </div>
            </div>
          </div>

          {/* New Regime Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-purple-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">FY 25-26 Default</div>
            <div>
               <div className="flex items-center justify-between mb-4">
                <h4 className="text-purple-700 text-xs font-bold uppercase tracking-wider">New Regime</h4>
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-6 group-hover:text-purple-700 transition-colors">{formatCurrency(results.new)}</p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 flex justify-between">
                <span>Taxable Income</span>
                <span className="font-medium text-slate-700">{formatCurrency(results.taxableNew)}</span>
              </div>
              <div className="text-xs text-slate-500 flex justify-between">
                <span>Standard Ded.</span>
                <span className="font-medium text-slate-700">{formatCurrency(results.stdDedNew)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alerts / Info */}
        <div className="space-y-3">
            {results.taxableNew <= 1200000 && results.taxableNew > 700000 && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-green-800">Zero Tax Benefit Active</p>
                        <p className="text-xs text-green-700 mt-1 leading-relaxed">
                            Your taxable income is within the special <strong>₹12 Lakh limit</strong> for FY 25-26 under New Regime. Full 87A rebate applied.
                        </p>
                    </div>
                </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700 leading-relaxed space-y-2">
                    <p className="font-bold">FY 2025-26 Updates:</p>
                    <ul className="list-disc ml-4 space-y-1">
                        <li><strong>Salaried:</strong> No tax up to Gross Income of ₹12.75 Lakhs (due to ₹75k Std Deduction).</li>
                        <li><strong>Others:</strong> No tax up to Taxable Income of ₹12 Lakhs.</li>
                        <li>Marginal relief applies if income slightly exceeds these limits.</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">Enter all income and deduction values to calculate tax</p>
        </div>
      )}
    </div>
  );
};

export default IncomeTax;
