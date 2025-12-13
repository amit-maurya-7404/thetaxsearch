"use client"

import React, { useState } from 'react';
import { Calculator, HelpCircle, ArrowRight } from 'lucide-react';

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-flex items-center ml-2">
    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-lavender-600 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none leading-relaxed font-normal">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const GST: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [location, setLocation] = useState<'intra' | 'inter'>('intra'); // intra = Same State, inter = Different State

  const calculate = () => {
    let taxAmount = 0;
    let netAmount = 0;
    let totalAmount = 0;

    if (type === 'exclusive') {
      taxAmount = (amount * rate) / 100;
      netAmount = amount;
      totalAmount = amount + taxAmount;
    } else {
      netAmount = amount / (1 + rate / 100);
      taxAmount = amount - netAmount;
      totalAmount = amount;
    }

    return {
      tax: taxAmount,
      net: netAmount,
      total: totalAmount
    };
  };

  const { tax, net, total } = calculate();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
        <div className="bg-lavender-100 p-3 rounded-xl text-lavender-600">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
           <h3 className="text-xl font-bold text-slate-800">GST Calculator</h3>
           <p className="text-xs text-slate-500">Calculate tax liability and Input Tax Credit</p>
        </div>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              Transaction Amount
              <Tooltip content="Enter the base price (for Exclusive) or final price (for Inclusive)." />
            </label>
            <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lavender-500 outline-none text-lg font-medium transition-all"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">GST Rate Slab</label>
            <div className="flex gap-2">
              {[5, 12, 18, 28].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                    rate === r 
                      ? 'bg-gradient-to-br from-purple-600 via-lavender-600 to-purple-700 text-white shadow-md transform scale-105' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                Tax Type
                <Tooltip content="Exclusive: Tax is added ON TOP of the amount. Inclusive: Tax is included INSIDE the amount." />
              </label>
              <div className="flex flex-col gap-2">
                <button
                    onClick={() => setType('inclusive')}
                    className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left border flex justify-between items-center ${
                    type === 'inclusive' ? 'bg-lavender-50 border-lavender-200 text-lavender-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    With GST
                    {type === 'inclusive' && <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>}
                </button>
                <button
                    onClick={() => setType('exclusive')}
                    className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left border flex justify-between items-center ${
                    type === 'exclusive' ? 'bg-lavender-50 border-lavender-200 text-lavender-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    Without GST
                    {type === 'exclusive' && <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>}
                </button>
                
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                Buyer Location
                <Tooltip content="Intra-State: Within same state (CGST+SGST). Inter-State: Across different states (IGST)." />
              </label>
              <div className="flex flex-col gap-2">
                 <button
                    onClick={() => setLocation('intra')}
                    className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left border flex justify-between items-center ${
                    location === 'intra' ? 'bg-lavender-50 border-lavender-200 text-lavender-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    Same State (CGST + SGST)
                    {location === 'intra' && <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>}
                </button>
                <button
                    onClick={() => setLocation('inter')}
                    className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left border flex justify-between items-center ${
                    location === 'inter' ? 'bg-lavender-50 border-lavender-200 text-lavender-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    Different State (IGST)
                    {location === 'inter' && <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-center h-full">
            <div className="bg-gradient-to-br from-gray-600 via-gray-600 to-gray-700  rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-lavender-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                
                <h4 className="text-white text-sm font-medium uppercase tracking-wider mb-8">Summary Breakdown</h4>

                <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                        <span className="text-slate-300">Net Amount</span>
                        <span className="text-2xl font-semibold">{formatCurrency(net)}</span>
                    </div>
                    
                    {location === 'intra' ? (
                        <div className="space-y-3 border-b border-slate-700 pb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300 text-sm flex items-center gap-2">
                                    CGST <span className="text-[14px] bg-slate-800 px-1.5 py-0.5 rounded">{rate/2}%</span>
                                </span>
                                <span className="text-lavender-400 font-medium">{formatCurrency(tax/2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300 text-sm flex items-center gap-2">
                                    SGST <span className="text-[14px] bg-slate-800 px-1.5 py-0.5 rounded">{rate/2}%</span>
                                </span>
                                <span className="text-lavender-400 font-medium">{formatCurrency(tax/2)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                            <span className="text-slate-400 flex items-center gap-2">
                                IGST <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{rate}%</span>
                            </span>
                            <span className="text-lavender-400 font-medium text-lg">{formatCurrency(tax)}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold">Total Payable</span>
                        <span className="text-3xl font-bold text-lavender-400">{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 flex items-start gap-3 px-2">
                <div className="bg-blue-50 p-1.5 rounded-full mt-0.5">
                     <ArrowRight className="w-3 h-3 text-blue-600" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Tip:</strong> If you are buying for business use, you can claim <strong>{formatCurrency(tax)}</strong> as Input Tax Credit (ITC) to reduce your own tax liability.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GST;
