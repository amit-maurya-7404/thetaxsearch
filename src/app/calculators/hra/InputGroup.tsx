"use client"

import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
  tooltip?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, icon, tooltip }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {tooltip && (
          <span className="text-xs text-gray-400 cursor-help" title={tooltip}>
            Help
          </span>
        )}
      </div>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">₹</span>
        </div>
        <input
          type="number"
          min="0"
          className="block w-full rounded-md border-0 py-2.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white transition-all"
          placeholder="0"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
           {icon}
        </div>
      </div>
    </div>
  );
};

export default InputGroup;
