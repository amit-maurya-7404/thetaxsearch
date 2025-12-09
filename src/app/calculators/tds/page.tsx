"use client"

import React, { useState } from 'react';
import { Calculator, AlertCircle, Info, ChevronRight, Check, HelpCircle } from 'lucide-react';

interface TDSSection {
  id: string;
  section: string;
  name: string;
  rateInd: number;
  rateOther: number;
  desc: string;
}

const tdsSections: TDSSection[] = [
  { id: '194C_ind', section: '194C', name: 'Contractor - Individual/HUF', rateInd: 1, rateOther: 1, desc: 'Payment to contractors (Individual/HUF)' },
  { id: '194C_other', section: '194C', name: 'Contractor - Others', rateInd: 2, rateOther: 2, desc: 'Payment to contractors (Companies/Firms)' },
  { id: '194H', section: '194H', name: 'Commission or Brokerage', rateInd: 2, rateOther: 2, desc: 'Commission and brokerage payments' },
  { id: '194J_tech', section: '194J(a)', name: 'Technical Services', rateInd: 2, rateOther: 2, desc: 'Fees for technical services' },
  { id: '194J_prof', section: '194J(b)', name: 'Professional Services', rateInd: 10, rateOther: 10, desc: 'Fees for professional services' },
  { id: '194I_plant', section: '194I(a)', name: 'Rent - Plant & Machinery', rateInd: 2, rateOther: 2, desc: 'Rent for plant and machinery' },
  { id: '194I_land', section: '194I(b)', name: 'Rent - Land/Building/Furniture', rateInd: 10, rateOther: 10, desc: 'Rent for land, building, or furniture' },
  { id: '194IA', section: '194IA', name: 'Property Purchase', rateInd: 1, rateOther: 1, desc: 'TDS on property purchase' },
  { id: '194O', section: '194O', name: 'E-commerce Seller Payments', rateInd: 0.10, rateOther: 0.10, desc: 'TDS on e-commerce seller payments' },
  { id: '194Q', section: '194Q', name: 'Purchase of Goods (>₹50L)', rateInd: 0.10, rateOther: 0.10, desc: 'TDS on purchase of goods exceeding ₹50 lakh' },
  { id: '194R', section: '194R', name: 'Business/Profession Perquisites', rateInd: 10, rateOther: 10, desc: 'TDS on perquisites from business/profession' },
];

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-flex items-center ml-2">
    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-purple-600 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none leading-relaxed font-normal">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const TDS: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('194C_ind');
  const [payeeType, setPayeeType] = useState<'individual' | 'other'>('individual');
  const [amount, setAmount] = useState<number | null>(null);
  const [panAvailable, setPanAvailable] = useState<boolean>(true);

  const selectedSection = tdsSections.find(s => s.id === selectedSectionId) || tdsSections[0];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const calculateTDS = () => {
    if (amount === null) return null;
    
    const rate = payeeType === 'individual' ? selectedSection.rateInd : selectedSection.rateOther;
    const tdsAmount = (amount * rate) / 100;
    const netPayment = amount - tdsAmount;
    
    return {
      tdsRate: rate,
      tdsAmount: tdsAmount,
      netPayment: netPayment,
    };
  };

  const results = calculateTDS() || { tdsRate: 0, tdsAmount: 0, netPayment: 0 };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
        <div className="bg-green-100 p-3 rounded-xl text-green-600">
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
                className="w-full pl-4 pr-10 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none appearance-none cursor-pointer transition-all hover:border-purple-300"
              >
                {tdsSections.map((s) => (
                  <option key={s.id} value={s.id}>{s.section} - {s.name}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
            </div>
            <div className="mt-3 flex items-start gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                <Info className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <p>{selectedSection.desc}</p>
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
               Payee Type
               <Tooltip content="Tax rate may differ for Individuals vs Companies." />
            </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setPayeeType('individual')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      payeeType === 'individual' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-600'
                    }`}
                  >
                    Individual / HUF
                  </button>
                  <button
                    onClick={() => setPayeeType('other')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      payeeType === 'other' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-600'
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
                    value={amount ?? ''}
                    onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="Enter payment amount"
                    className="w-full pl-8 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium"
                   />
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors">
                <label htmlFor="panCheck" className="text-sm font-medium text-slate-700 cursor-pointer select-none flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded border bg-white border-slate-300 peer-checked:bg-purple-500 peer-checked:border-purple-500">
                    {panAvailable && <Check className="w-3 h-3 text-purple-600" />}
                  </span>
                  Is Valid PAN Available?
                </label>
                <input
                  type="checkbox"
                  id="panCheck"
                  checked={panAvailable}
                  onChange={(e) => setPanAvailable(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>
              {!panAvailable && (
                 <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Warning: If PAN is not provided, TDS will be deducted at a higher rate of 20% (Section 206AA).</span>
                 </div>
              )}
            </div>

        {/* Results */}
        <div className="flex flex-col h-full">
           <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex-1 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 text-center mb-8">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
                    TDS Liability
                </p>
                <p className="text-5xl font-bold text-white tracking-tight">{formatCurrency(results.tdsAmount)}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">TDS Rate</span>
                    <span className="font-bold text-white">{results.tdsRate}%</span>
                </div>
                <div className="w-full h-px bg-white/10"></div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Net Payment</span>
                    <span className="font-bold text-white text-lg">{formatCurrency(results.netPayment)}</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TDS;
