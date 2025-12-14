"use client"

import { motion } from "framer-motion"
import { CalculatorCard } from "@/components/CalculatorCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from 'react'
import IncomeTax from './income-tax/page'
import GST from './gst/page'
import TDS from './tds/page'
import HRA from './hra/page'
import { PieChart, DollarSign, Percent, Home } from 'lucide-react'
import { CTASection } from "@/components/CTAButtons"

const Calculators: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'income' | 'gst' | 'tds' | 'hra'>('income')

	useEffect(() => {
		const updateFromHash = () => {
			if (typeof window === 'undefined') return
			const h = window.location.hash.replace('#', '')
			if (!h) return
			if (h.startsWith('income')) setActiveTab('income')
			else if (h.startsWith('gst')) setActiveTab('gst')
			else if (h.startsWith('tds')) setActiveTab('tds')
			else if (h.startsWith('hra')) setActiveTab('hra')

			const el = document.getElementById(h)
			if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
		}

		updateFromHash()
		window.addEventListener('hashchange', updateFromHash)
		return () => window.removeEventListener('hashchange', updateFromHash)
	}, [])

	return (
		<div className="min-h-screen bg-white pb-0">
			<div className="bg-gradient-to-r from-primary to-primary-light text-white py-20 shadow-lg relative overflow-hidden">
				<div className="absolute inset-0 bg-black/5"></div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Financial Tools & Calculators</h1>
					<p className="text-purple-50 max-w-2xl mx-auto text-lg leading-relaxed">
						Precise calculations based on the latest FY 2025-26 tax laws. Simplify your financial planning today.
					</p>
				</div>
			</div>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-10">
			{/* Navigation Tabs */}
			<div className="bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-2 mb-8 z-10 relative">
				<button
					onClick={() => { setActiveTab('income'); if (typeof window !== 'undefined') window.location.hash = '#income-tax' }}
					className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${activeTab === 'income' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-50'
						}`}
				>
					<PieChart className="w-4 h-4" /> Income Tax
				</button>
				<button
					onClick={() => { setActiveTab('gst'); if (typeof window !== 'undefined') window.location.hash = '#gst' }}
					className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${activeTab === 'gst' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-50'
						}`}
				>
					<DollarSign className="w-4 h-4" /> GST
				</button>
				<button
					onClick={() => { setActiveTab('tds'); if (typeof window !== 'undefined') window.location.hash = '#tds' }}
					className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${activeTab === 'tds' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-50'
						}`}
				>
					<Percent className="w-4 h-4" /> TDS
				</button>
				<button
					onClick={() => { setActiveTab('hra'); if (typeof window !== 'undefined') window.location.hash = '#hra' }}
					className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${activeTab === 'hra' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-50'
						}`}
				>
					<Home className="w-4 h-4" /> HRA
				</button>
			</div> 				/* Content Area */
				<div className="animate-fadeIn">
					{activeTab === 'income' && <IncomeTax />}
					{activeTab === 'gst' && <GST />}
					{activeTab === 'tds' && <TDS />}
				{activeTab === 'hra' && <HRA />}
				</div>
			</div>
			{/* CTA Section */}
			<CTASection />
		</div>

	)
}

export default Calculators
