"use client"

import { motion } from "framer-motion"
import { CalculatorCard } from "@/components/CalculatorCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
	DollarSign,
	Home as HomeIcon,
	BarChart3,
	ReceiptText,
	Search,
	ArrowLeft,
} from "lucide-react"

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
}

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
}

export default function CalculatorsPage() {
	const calculators = [
		{
			title: "Income Tax",
			description: "Calculate your income tax liability with new and old regime options",
			href: "/calculators/income-tax",
			icon: <DollarSign className="w-8 h-8 text-primary" />,
		},
		{
			title: "GST",
			description: "GST calculator for businesses and tax calculations",
			href: "/calculators/gst",
			icon: <ReceiptText className="w-8 h-8 text-primary" />,
		},
		{
			title: "HRA",
			description: "Calculate HRA exemption and tax savings",
			href: "/calculators/hra",
			icon: <HomeIcon className="w-8 h-8 text-primary" />,
		},
		{
			title: "TDS",
			description: "TDS calculation tool for various income sources",
			href: "/calculators/tds",
			icon: <BarChart3 className="w-8 h-8 text-primary" />,
		},
		{
			title: "GST Search",
			description: "Search and verify GST details by GSTIN",
			href: "/calculators/gst-search",
			icon: <Search className="w-8 h-8 text-primary" />,
		},
	]

	return (
		<div className="w-full">
			{/* Header Section */}
			<section className="py-12 bg-gradient-to-r from-primary to-primary-light text-white">
				<motion.div
					className="container max-w-7xl mx-auto px-4"
					initial="initial"
					animate="animate"
					variants={fadeInUp}
				>
					<Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Home
					</Link>
					<h1 className="text-4xl md:text-5xl font-bold mb-4">All Calculators</h1>
					<p className="text-lg text-white/90 max-w-2xl">
						Comprehensive suite of tax and financial calculators to help you make informed decisions. All calculators are free to use and updated with latest tax rates.
					</p>
				</motion.div>
			</section>

			{/* Calculators Grid */}
			<section className="py-16 md:py-20">
				<motion.div
					className="container max-w-7xl mx-auto px-4"
					initial="initial"
					whileInView="animate"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
						variants={staggerContainer}
					>
						{calculators.map((calc, i) => (
							<motion.div key={i} variants={fadeInUp}>
								<div className="h-full">
									<CalculatorCard {...calc} />
								</div>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* Features Section */}
			<section className="py-16">
				<motion.div
					className="container max-w-7xl mx-auto px-4"
					initial="initial"
					whileInView="animate"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<motion.div className="text-center mb-12" variants={fadeInUp}>
						<h2 className="text-3xl font-bold mb-4">Why Use Our Calculators?</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Get accurate tax calculations with just a few clicks
						</p>
					</motion.div>

					<motion.div
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
						variants={staggerContainer}
					>
						{[
							{
								title: "Accurate & Updated",
								description: "Based on latest FY 2024-25 tax laws and regulations",
							},
							{
								title: "100% Free",
								description: "No hidden charges or premium features required",
							},
							{
								title: "Privacy First",
								description: "All calculations done locally, your data stays private",
							},
							{
								title: "Easy to Use",
								description: "Simple interface designed for everyone",
							},
							{
								title: "Instant Results",
								description: "Get calculations in real-time",
							},
							{
								title: "Expert Support",
								description: "Get help from tax experts if needed",
							},
						].map((feature, i) => (
							<motion.div
								key={i}
								variants={fadeInUp}
								className="p-6 rounded-lg border bg-card"
							>
								<h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-primary/5 border-y">
				<motion.div
					className="container max-w-7xl mx-auto px-4 text-center"
					initial="initial"
					whileInView="animate"
					variants={fadeInUp}
					viewport={{ once: true }}
				>
					<h2 className="text-3xl font-bold mb-4">Need Professional Help?</h2>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Our team of tax experts is ready to help you with personalized guidance and consultation.
					</p>
					<Link href="/services">
						<Button size="lg" className="mr-4">
							View Services
						</Button>
					</Link>
					<Link href="/#contact">
						<Button size="lg" variant="outline">
							Contact Us
						</Button>
					</Link>
				</motion.div>
			</section>
		</div>
	)
}
