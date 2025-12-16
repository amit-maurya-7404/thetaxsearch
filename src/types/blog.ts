import React from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface Category {
  id: string;
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  image: string;
  content: string; // HTML string for rich text
  attachment?: {
    name: string;
    url: string; // Data URL
    type: 'pdf' | 'word' | 'image' | 'other';
    size: string;
  };
}

export enum CalculatorType {
  INCOME_TAX = 'INCOME_TAX',
  GST = 'GST',
  TDS = 'TDS',
  HRA = 'HRA',
}

export interface TaxRegimeResult {
  oldRegimeTax: number;
  newRegimeTax: number;
  difference: number;
  betterRegime: 'Old' | 'New' | 'Equal';
}
