"use client"

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import InputGroup from './InputGroup';
import { calculateHRAExemption } from './taxCalculations';
import { CheckCircle, Calculator, MapPin, CalendarClock } from 'lucide-react';

const COLORS = ['#22c55e', '#ef4444'];

type Frequency = 'monthly' | 'yearly';

const HRACalculator: React.FC = () => {
  const [frequency, setFrequency] = useState<Frequency>('yearly');
  const [basic, setBasic] = useState(600000);
  const [da, setDA] = useState(0);
  const [hra, setHra] = useState(300000);
  const [rent, setRent] = useState(240000);
  const [isMetro, setIsMetro] = useState(true);

  const handleFrequencyChange = (newFreq: Frequency) => {
    if (newFreq === frequency) return;
    const factor = newFreq === 'yearly' ? 12 : 1/12;
    setBasic(prev => Math.round(prev * factor));
    setDA(prev => Math.round(prev * factor));
    setHra(prev => Math.round(prev * factor));
    setRent(prev => Math.round(prev * factor));
    setFrequency(newFreq);
  };

  const totalBasic = basic + da;
  const exemptHRA = calculateHRAExemption(totalBasic, hra, rent, isMetro);
  const taxableHRA = Math.max(0, hra - exemptHRA);

  const chartData = [
    { name: `Exempt HRA`, value: exemptHRA },
    { name: `Taxable HRA`, value: taxableHRA },
  ].filter(d => d.value > 0);
  
  const condition1 = hra;
  const condition2 = totalBasic * (isMetro ? 0.5 : 0.4);
  const condition3 = Math.max(0, rent - (totalBasic * 0.1));

  const labelSuffix = frequency === 'yearly' ? '(Annual)' : '(Monthly)';

  return (
    <div id="hra" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
             <div className="flex items-center gap-3">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <Calculator className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">HRA Details</h3>
                    <p className="text-sm text-gray-500">Calculate exemption {frequency}</p>
                </div>
             </div>

             <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                <button
                    onClick={() => handleFrequencyChange('monthly')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        frequency === 'monthly' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => handleFrequencyChange('yearly')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        frequency === 'yearly' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Yearly
                </button>
             </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <InputGroup
              label={`Basic Salary ${labelSuffix}`}
              value={basic}
              onChange={(v) => setBasic(v)}
              tooltip={`Your ${frequency} basic salary component.`}
            />
            <InputGroup
              label={`DA ${labelSuffix}`}
              value={da}
              onChange={(v) => setDA(v)}
              tooltip={`Dearness Allowance ${frequency}.`}
            />
            <InputGroup
              label={`HRA Received ${labelSuffix}`}
              value={hra}
              onChange={(v) => setHra(v)}
              tooltip={`HRA received from employer ${frequency}.`}
            />
            <InputGroup
              label={`Rent Paid ${labelSuffix}`}
              value={rent}
              onChange={(v) => setRent(v)}
              tooltip={`Rent paid by you ${frequency}.`}
            />
            
            <div className="col-span-1 md:col-span-2 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
               <label className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" /> City Type
               </label>
               <div className="flex gap-6">
                   <label className="flex items-center cursor-pointer">
                       <input 
                           type="radio" 
                           checked={isMetro} 
                           onChange={() => setIsMetro(true)}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                       />
                       <span className="ml-2 text-sm text-gray-700">Metro City (Delhi, Mumbai, Kolkata, Chennai)</span>
                   </label>
                   <label className="flex items-center cursor-pointer">
                       <input 
                           type="radio" 
                           checked={!isMetro} 
                           onChange={() => setIsMetro(false)}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                       />
                       <span className="ml-2 text-sm text-gray-700">Non-Metro City</span>
                   </label>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h3 className="text-md font-semibold text-gray-900 mb-4">Calculation Logic (Lowest is exempt)</h3>
           <div className="space-y-3">
              <div className={`flex justify-between items-center p-3 rounded-lg border ${exemptHRA === condition1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                 <span className="text-sm text-gray-600">1. Actual HRA Received</span>
                 <span className="font-medium text-gray-900">₹{condition1.toLocaleString('en-IN')}</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg border ${exemptHRA === condition2 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                 <span className="text-sm text-gray-600">2. {isMetro ? '50%' : '40%'} of Salary (Basic + DA)</span>
                 <span className="font-medium text-gray-900">₹{condition2.toLocaleString('en-IN')}</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg border ${exemptHRA === condition3 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                 <span className="text-sm text-gray-600">3. Rent Paid - 10% of Salary</span>
                 <span className="font-medium text-gray-900">₹{condition3.toLocaleString('en-IN')}</span>
              </div>
           </div>
           <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
             <CheckCircle className="w-3 h-3 text-green-600" /> The highlighted amount is your HRA Exemption.
           </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
          <div className="p-6 bg-gradient-to-r from-purple-600 via-purple-600 to-pink-700 text-white">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              HRA Result <span className="text-sm font-normal opacity-80 bg-white/10 px-2 py-0.5 rounded capitalize">{frequency}</span>
            </h2>
          </div>
          
          <div className="p-6">
             <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-center">
                     <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Exempted</p>
                     <p className="text-2xl font-bold text-gray-900 mt-1">₹{exemptHRA.toLocaleString('en-IN')}</p>
                 </div>
                 <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                     <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Taxable</p>
                     <p className="text-2xl font-bold text-gray-900 mt-1">₹{taxableHRA.toLocaleString('en-IN')}</p>
                 </div>
             </div>

             <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name.startsWith('Exempt') ? COLORS[0] : COLORS[1]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                   <span className="text-xs text-gray-500 font-medium">Total HRA</span>
                   <span className="text-lg font-bold text-gray-800">₹{hra.toLocaleString('en-IN')}</span>
                </div>
             </div>
             
             <div className="mt-4 p-4 bg-blue-50 text-blue-900 text-sm rounded-lg border border-blue-100">
               <p className="flex items-start gap-2">
                 <CalendarClock className="w-4 h-4 mt-0.5 shrink-0" />
                 <span>
                    <strong>{frequency === 'yearly' ? 'Annual' : 'Monthly'} Impact:</strong> You can claim <strong>₹{exemptHRA.toLocaleString('en-IN')}</strong> as tax-exempt. 
                    The remaining <strong>₹{taxableHRA.toLocaleString('en-IN')}</strong> is added to your taxable income.
                 </span>
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRACalculator;
