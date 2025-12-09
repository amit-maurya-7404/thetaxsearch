"use client"

import React, { useState } from 'react';
import { Home, HelpCircle } from 'lucide-react';

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-flex items-center ml-2">
    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-purple-600 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none leading-relaxed font-normal">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const HRA: React.FC = () => {
  const [basicSalary, setBasicSalary] = useState<number | null>(null);
  const [hraReceived, setHraReceived] = useState<number | null>(null);
  const [rentPaid, setRentPaid] = useState<number | null>(null);
  const [isMetro, setIsMetro] = useState(true);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const calculateHRA = () => {
    if (basicSalary === null || hraReceived === null || rentPaid === null) {
      return null;
    }

    const basic = basicSalary;
    const hra = hraReceived;
    const rent = rentPaid;

    // A = Actual HRA Received
    const A = hra;

    // B = 50% of Basic Salary (if Metro) or 40% of Basic Salary (if Non-Metro)
    const B = isMetro ? basic * 0.50 : basic * 0.40;

    // C = Rent Paid - 10% of Basic Salary
    // If rentPaid < 10% of basic => C = 0
    const C = Math.max(0, rent - (basic * 0.10));

    // EXEMPTION RULE: hraExempt = min(A, B, C)
    const hraExempt = Math.min(A, B, C);

    // TAXABLE HRA: hraTaxable = hraReceived - hraExempt
    const hraTaxable = hra - hraExempt;

    return {
      hraExempt: hraExempt,
      hraTaxable: hraTaxable,
      annualExempt: hraExempt * 12,
      annualTaxable: hraTaxable * 12,
    };
  };

  const results = calculateHRA();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
        <div className="bg-pink-100 p-3 rounded-xl text-pink-600">
          <Home className="w-6 h-6" />
        </div>
        <div>
           <h3 className="text-xl font-bold text-slate-800">HRA Calculator</h3>
           <p className="text-xs text-slate-500">Section 10(13A) Exemption</p>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Inputs */}
        <div className="space-y-8">
          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              Monthly Basic Salary
              <Tooltip content="Your monthly basic salary (excluding allowances)." />
            </label>
            <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                <input
                type="number"
                value={basicSalary ?? ''}
                onChange={(e) => setBasicSalary(e.target.value === '' ? null : Number(e.target.value))}
                placeholder="Enter basic salary"
                className="w-full pl-8 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-medium transition-all"
                />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              Monthly HRA Received
              <Tooltip content="The actual HRA you receive every month." />
            </label>
            <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                <input
                type="number"
                value={hraReceived ?? ''}
                onChange={(e) => setHraReceived(e.target.value === '' ? null : Number(e.target.value))}
                placeholder="Enter HRA received"
                className="w-full pl-8 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-medium transition-all"
                />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              Monthly Rent Paid
              <Tooltip content="Actual rent paid by you every month (excluding utilities)." />
            </label>
            <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                <input
                type="number"
                value={rentPaid ?? ''}
                onChange={(e) => setRentPaid(e.target.value === '' ? null : Number(e.target.value))}
                placeholder="Enter rent paid"
                className="w-full pl-8 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-medium transition-all"
                />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
              City Category
              <Tooltip content="Select your city category for HRA percentage calculation." />
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMetro(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                  isMetro 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Metro (50%)
              </button>
              <button
                onClick={() => setIsMetro(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                  !isMetro 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Non-Metro (40%)
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-center h-full">
            {results ? (
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-20 translate-y-1/2 translate-x-1/2"></div>
                
                <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-8">HRA Calculation</h4>

                <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                        <span className="text-slate-300">Monthly HRA Exempt</span>
                        <span className="text-2xl font-semibold">{formatCurrency(results.hraExempt)}</span>
                    </div>
                    
                    <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                        <span className="text-slate-300">Monthly HRA Taxable</span>
                        <span className="text-2xl font-semibold text-red-400">{formatCurrency(results.hraTaxable)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-slate-400">Annual HRA Exempt</span>
                        <span className="text-lg font-bold text-green-400">{formatCurrency(results.annualExempt)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Annual HRA Taxable</span>
                        <span className="text-lg font-bold text-red-400">{formatCurrency(results.annualTaxable)}</span>
                    </div>
                </div>
            </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">Enter all values to calculate HRA</p>
              </div>
            )}
            
            <div className="mt-6 flex items-start gap-3 px-2">
                <div className="bg-blue-50 p-1.5 rounded-full mt-0.5">
                     <HelpCircle className="w-3 h-3 text-blue-600" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Formula:</strong> Exempt HRA = min(Actual HRA, 50% Basic [Metro] / 40% Basic [Non-Metro], Rent - 10% Basic)
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HRA;
