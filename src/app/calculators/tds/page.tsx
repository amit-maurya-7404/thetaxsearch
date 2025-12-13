"use client"

import React, { useState } from 'react';
import { Calculator, AlertCircle, Info, ChevronRight, Check, HelpCircle } from 'lucide-react';

interface TDSSection {
  id: string;
  section: string;
  name: string;
  threshold: number;
  rateInd: number; // Rate for Individual/HUF
  rateOther: number; // Rate for Others (Company/Firm)
  type: 'flat' | 'salary';
  desc: string;
}

const tdsSections: TDSSection[] = [
  { id: '194J_prof', section: '194J', name: 'Fees for Professional Services', threshold: 30000, rateInd: 10, rateOther: 10, type: 'flat', desc: 'Medical, Legal, Architectural, Engineering services, etc.' },
  { id: '194J_tech', section: '194J', name: 'Fees for Technical Services / Royalty', threshold: 30000, rateInd: 2, rateOther: 2, type: 'flat', desc: 'Technical consultancy, royalty payments for tech usage.' },
  { id: '194C_single', section: '194C', name: 'Payment to Contractors (Single)', threshold: 30000, rateInd: 1, rateOther: 2, type: 'flat', desc: 'Single contract payment exceeding ₹30,000.' },
  { id: '194I_land', section: '194I', name: 'Rent (Land/Building)', threshold: 240000, rateInd: 10, rateOther: 10, type: 'flat', desc: 'Rent for office, factory, land, etc. > ₹2.4L/year.' },
  { id: '194I_plant', section: '194I', name: 'Rent (Plant & Machinery)', threshold: 240000, rateInd: 2, rateOther: 2, type: 'flat', desc: 'Rent for equipment, machinery, etc. > ₹2.4L/year.' },
  { id: '194H', section: '194H', name: 'Commission or Brokerage', threshold: 15000, rateInd: 5, rateOther: 5, type: 'flat', desc: 'Payments to agents/brokers > ₹15,000/year.' },
  { id: '194A', section: '194A', name: 'Interest (Non-Securities)', threshold: 5000, rateInd: 10, rateOther: 10, type: 'flat', desc: 'Interest from banks/others > ₹40k (Banks) or ₹5k (Others).' },
  { id: '192', section: '192', name: 'Salary (Average Rate)', threshold: 0, rateInd: 0, rateOther: 0, type: 'salary', desc: 'TDS deducted by employer based on income tax slab rates.' },
];

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-flex items-center ml-2">
    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-lavender-600 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none leading-relaxed font-normal">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const TDS: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('194J_prof');
  const [payeeType, setPayeeType] = useState<'individual' | 'other'>('individual');
  const [amount, setAmount] = useState<number>(50000);
  const [panAvailable, setPanAvailable] = useState<boolean>(true);
  const [annualSalary, setAnnualSalary] = useState<number>(1200000);

  const selectedSection = tdsSections.find(s => s.id === selectedSectionId) || tdsSections[0];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const calculateTDS = () => {
    if (selectedSection.type === 'salary') {
        const standardDeduction = 75000;
        const taxable = Math.max(0, annualSalary - standardDeduction);
        let tax = 0;
        if (taxable > 1500000) tax += (taxable - 1500000) * 0.30 + 140000;
        else if (taxable > 1200000) tax += (taxable - 1200000) * 0.20 + 80000;
        else if (taxable > 1000000) tax += (taxable - 1000000) * 0.15 + 50000;
        else if (taxable > 700000) tax += (taxable - 700000) * 0.10 + 20000;
        else if (taxable > 300000) tax += (taxable - 300000) * 0.05;
        
        if (taxable <= 700000) tax = 0;
        const totalTax = tax * 1.04;
        return {
            rateApplied: annualSalary > 0 ? (totalTax / annualSalary * 100).toFixed(2) : "0.00",
            tdsAmount: totalTax,
            netAmount: annualSalary - totalTax,
            monthlyTDS: totalTax / 12
        };
    } else {
        let rate = payeeType === 'individual' ? selectedSection.rateInd : selectedSection.rateOther;
        if (!panAvailable) rate = Math.max(rate, 20);
        if (amount <= selectedSection.threshold) return { rateApplied: '0', tdsAmount: 0, netAmount: amount, monthlyTDS: 0 };
        const tdsAmount = (amount * rate) / 100;
        return { rateApplied: rate.toString(), tdsAmount, netAmount: amount - tdsAmount, monthlyTDS: 0 };
    }
  };

  const results = calculateTDS();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
        <div className="bg-lavender-100 p-3 rounded-xl text-lavender-600">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
           <h3 className="text-xl font-bold text-slate-800">TDS Calculator</h3>
           <p className="text-xs text-slate-500">FY 2025-26 Compliance</p>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Inputs */}
        <div className="space-y-8">
          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              Nature of Payment
              <Tooltip content="Select the relevant section. Hover over the info icon next to options for details." />
            </label>
            <div className="relative group">
              <select 
                value={selectedSectionId} 
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none appearance-none cursor-pointer transition-all hover:border-lavender-300"
              >
                {tdsSections.map((s) => (
                  <option key={s.id} value={s.id}>{s.section} - {s.name}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
            </div>
            <div className="mt-3 flex items-start gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                <Info className="w-4 h-4 text-lavender-600 shrink-0 mt-0.5" />
                <p>{selectedSection.desc}</p>
            </div>
          </div>

          {selectedSection.type === 'salary' ? (
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                Estimated Annual Salary
                <Tooltip content="Total Gross Salary for the year." />
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                   Payee Type
                   <Tooltip content="Tax rate may differ for Individuals vs Companies." />
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setPayeeType('individual')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      payeeType === 'individual' ? 'bg-white text-lavender-700 shadow-sm' : 'text-slate-500 hover:text-slate-600'
                    }`}
                  >
                    Individual / HUF
                  </button>
                  <button
                    onClick={() => setPayeeType('other')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      payeeType === 'other' ? 'bg-white text-lavender-700 shadow-sm' : 'text-slate-500 hover:text-slate-600'
                    }`}
                  >
                    Company / Firm
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                  Amount Paid / Credited
                  <Tooltip content="The amount on which TDS needs to be calculated." />
                </label>
                <div className="relative">
                   <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                   <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none font-medium"
                   />
                </div>
                <div className="mt-2 text-xs font-medium text-slate-500 flex justify-between px-1">
                   <span>Threshold Limit: {formatCurrency(selectedSection.threshold)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-lavender-200 transition-colors">
                <label htmlFor="panCheck" className="text-sm font-medium text-slate-700 cursor-pointer select-none flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded border bg-white border-slate-300 peer-checked:bg-lavender-500 peer-checked:border-lavender-500">
                    {panAvailable && <Check className="w-3 h-3 text-lavender-600" />}
                  </span>
                  Is Valid PAN Available?
                </label>
                <input
                  type="checkbox"
                  id="panCheck"
                  checked={panAvailable}
                  onChange={(e) => setPanAvailable(e.target.checked)}
                  className="w-5 h-5 accent-lavender-600 cursor-pointer"
                />
              </div>
              {!panAvailable && (
                 <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Warning: If PAN is not provided, TDS will be deducted at a higher rate of 20% (Section 206AA).</span>
                 </div>
              )}
            </>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col h-full">
           <div className="bg-gradient-to-br from-gray-900 via-gray-600 to-gray-800 rounded-3xl p-8 text-white shadow-xl flex-1 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-lavender-600 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 text-center mb-8">
                <p className="text-slate-300 text-sm font-medium uppercase tracking-wider mb-2">
                    {selectedSection.type === 'salary' ? 'Estimated Yearly TDS' : 'TDS Liability'}
                </p>
                <p className="text-5xl font-bold text-white tracking-tight">{formatCurrency(results.tdsAmount)}</p>
                {selectedSection.type === 'salary' && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">
                        <span className="text-slate-400">Monthly:</span>
                        <span className="font-bold text-lavender-400">{formatCurrency(results.monthlyTDS)}</span>
                    </div>
                )}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                    <span className="text-slate-200 text-sm">Rate Applied</span>
                    <span className="font-bold text-white">{results.rateApplied}%</span>
                </div>
                <div className="w-full h-px bg-white/10"></div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-200 text-sm">{selectedSection.type === 'salary' ? 'Net Annual Salary' : 'Net Payment'}</span>
                    <span className="font-bold text-white text-lg">{formatCurrency(results.netAmount)}</span>
                </div>
              </div>

              {selectedSection.type !== 'salary' && results.tdsAmount === 0 && amount > 0 && (
                 <div className="mt-6 bg-green-500/10 text-green-300 p-3 rounded-xl text-sm flex items-start gap-3 border border-green-500/20">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>No TDS required. Amount is within the threshold of {formatCurrency(selectedSection.threshold)}.</span>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TDS;
