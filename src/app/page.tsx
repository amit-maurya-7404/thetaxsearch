"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CTASection } from "@/components/CTAButtons"
import { ServiceCard } from "@/components/ServiceCard"
import { CalculatorCard } from "@/components/CalculatorCard"
import { BlogCard } from "@/components/BlogCard"
import { FAQ } from "@/components/FAQ"
import Link from "next/link"
import {
	FileText,
	Calculator,
	Users,
	TrendingUp,
	CheckCircle,
	Clock,
	BarChart3,
	CreditCard,
	DollarSign,
	Home as HomeIcon,
	Search,
	ReceiptText,
	AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { services as allServices } from '@/lib/services'
// useMemo removed to avoid server/client randomness for services preview

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

export default function Home() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			})
			if (response.ok) {
				alert("Message sent successfully! We'll get back to you soon.")
				setFormData({ name: "", email: "", phone: "", message: "" })
			}
		} catch (error) {
			alert("Failed to send message. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}

	const faqItems = [
		{
			question: "How accurate are your calculators?",
			answer:
				"Our calculators are based on current Indian tax laws and regulations. However, for precise calculations and personalized advice, we recommend consulting with our tax experts.",
		},
		{
			question: "Is my data safe with you?",
			answer:
				"Yes, we prioritize your data security. All calculations are performed locally in your browser, and we don't store any personal financial information without your explicit consent.",
		},
		{
			question: "Do you offer consultation services?",
			answer:
				"Absolutely! We offer free initial consultations. Click 'Book a Free Consultation' button or contact us via WhatsApp to schedule a session with our experts.",
		},
		{
			question: "What services do you provide?",
			answer:
				"We provide comprehensive tax compliance services including GST registration & returns, Income Tax filing, TDS payments, ROC Compliance, Book Keeping, Company & LLP Formation and much more. Visit our Services page to learn more.",
		},
		{
			question: "How often are your calculators updated?",
			answer:
				"We update our calculators regularly to reflect changes in tax laws and rates. Follow our blog for announcements about updates.",
		},
	]

	const blogPosts = [
		{
			slug: "gst-compliance-guide",
			title: "Complete Guide to GST Compliance in 2024",
			description:
				"Everything you need to know about GST registration, filing returns, and maintaining compliance...",
			date: "Nov 15, 2024",
			tags: ["GST", "Compliance", "2024"],
			readingTime: 8,
		},
		{
			slug: "income-tax-new-regime",
			title: "New vs Old Income Tax Regime: Which One is Better?",
			description:
				"A detailed comparison between the new and old tax regimes with real examples to help you decide...",
			date: "Nov 10, 2024",
			tags: ["Income Tax", "Tax Planning"],
			readingTime: 10,
		},
		{
			slug: "hra-exemption-rules",
			title: "Complete Guide to HRA Exemption Rules",
			description:
				"Understand HRA exemption limits, conditions, and how to maximize tax savings on house rent...",
			date: "Nov 5, 2024",
			tags: ["HRA", "Tax Savings", "Deductions"],
			readingTime: 6,
		},
	]

	function ServicesPreview() {
		const [randomServices, setRandomServices] = useState(() => allServices.slice(0, 3))

		useEffect(() => {
			const arr = [...allServices]
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[arr[i], arr[j]] = [arr[j], arr[i]]
			}
			setRandomServices(arr.slice(0, 3))
		}, [])

		return (
			<>
			<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer}>
				{randomServices.map((service) => {
					const Icon = service.icon
					return (
						<Link href={`/services/${service.slug}`} key={service.slug}>
							<motion.div
								variants={fadeInUp}
								whileHover={{ scale: 1.03, y: -6 }}
								whileTap={{ scale: 0.985 }}
								transition={{ type: "spring", stiffness: 280, damping: 20 }}
								className="card-shadow transition-all duration-300 h-full hover:border-primary hover:cursor-pointer flex flex-col bg-white border rounded-lg p-6"
							>
								<div className="pb-3">
									<div className={`${service.iconColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
										<Icon className="w-6 h-6" />
									</div>
									<h3 className="text-lg font-semibold text-left">{service.title}</h3>
								</div>
								<div className="flex-1 flex flex-col">
									{service.details && service.details.length > 0 && (
										<ul className="space-y-2 mb-6 flex-1">
											{service.details.map((d, idx) => (
												<li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
													<span className="text-primary font-bold">•</span>
													<span>{d}</span>
												</li>
											))}
										</ul>
									)}
								</div>
							</motion.div>
						</Link>
					)
				})}
			</motion.div>

			<div className="mt-8 flex justify-center">
				<Link href="/services">
					<Button size="lg" className="text-white bg-gradient-to-r from-purple-600 to-pink-500">
						View All Services
					</Button>
				</Link>
			</div>
			</>
		)
	}

	const team = [
		{ name: "Amit Maurya", role: "Founder & Tax Expert", bio: "15+ years experience in tax planning and corporate advisory." },
		{ name: "Priya Sharma", role: "GST Specialist", bio: "Expert in GST compliance, registrations and returns." },
		{ name: "Rohit Verma", role: "Senior CA", bio: "Income tax filings, audits and tax planning for businesses." },
		{ name: "Sneha Gupta", role: "TDS & Payroll Expert", bio: "Payroll, TDS compliance and employer advisory." },
		{ name: "Rahul Singh", role: "HRA & Advisory", bio: "HRA exemptions, housing tax planning and employee benefits." },
	]

	return (
		<div className="w-full">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/40 to-background pt-10 md:pt-0">
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
					<div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
				</div>

				<motion.div
					className="container max-w-7xl mx-auto px-4 relative z-10"
					initial="initial"
					animate="animate"
					variants={staggerContainer}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<motion.div variants={fadeInUp}>
							<h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-black">
								Your Trusted Partner in{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
									Tax Compliance
								</span>
							</h1>
							<p className="text-lg text-gray-700 mb-8 leading-relaxed">
								Simplify your tax journey with our comprehensive calculators, expert guidance, and
								professional services. From GST to Income Tax, we've got you covered.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/aboutus#contact-form-section">
									<Button size="lg" className="w-full text-white bg-gradient-to-r from-purple-600 to-pink-500 sm:w-auto">
										Book Free Consultation
									</Button>
								</Link>
								<Link href="/calculators">
									<Button
										size="lg"
										variant="outline"
										className="w-full sm:w-auto"
									>
										Try Calculators
									</Button>
								</Link>
							</div>
							<div className="flex gap-6 mt-10 text-sm text-black">
								<div className="flex items-center gap-2">
									<CheckCircle className="w-5 h-5 text-primary" />
									<span>100% Secure</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="w-5 h-5 text-primary" />
									<span>Expert Support</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="w-5 h-5 text-primary" />
									<span>Free Tools</span>
								</div>
							</div>
						</motion.div>

						<motion.div
							variants={fadeInUp}
							className="relative"
						>
							<div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 border border-primary/10">
								<div className="grid grid-cols-2 gap-4">
									{[
										{ label: "Happy Clients", value: "1500+" },
										{ label: "Years of Experience", value: "5+" },
										{ label: "Tax Filed", value: "13.5Cr+" },
										{ label: "Customer Support", value: "24/7" },
									].map((stat) => (
										<div
											key={stat.label}
											className="bg-background/50 backdrop-blur border border-border rounded-lg p-4 text-center"
										>
											<div className="text-2xl font-bold text-primary mb-1">
												{stat.value}
											</div>
											<div className="text-xs text-muted-foreground">
												{stat.label}
											</div>
										</div>
									))}
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</section>

			{/* Why Choose Us */}
			<section className="py-16 border-b">
				<motion.div
					className="container max-w-7xl mx-auto px-4"
					initial="initial"
					whileInView="animate"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<motion.div
						className="text-center mb-12"
						variants={fadeInUp}
					>
						<h2 className="text-4xl font-bold mb-4 text-black">Why Choose Us?</h2>
						<p className="text-lg text-gray-700 max-w-2xl mx-auto">
							We combine cutting-edge technology with expert knowledge to provide the best tax
							solutions
						</p>
					</motion.div>					<motion.div
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
						variants={staggerContainer}
					>
						{[
							{
								icon: Calculator,
								iconColor: 'bg-blue-100 text-blue-600',
								title: "Smart Calculators",
								details: [
									"GST, Income Tax & TDS",
									"HRA & House Property",
									"Real-time calculations",
									"Instant tax estimates",
								],
							},
							{
								icon: Users,
								iconColor: 'bg-green-100 text-green-600',
								title: "Expert Team",
								details: [
									"15+ years experience",
									"Qualified professionals",
									"24/7 customer support",
									"Personalized guidance",
								],
							},
							{
								icon: TrendingUp,
								iconColor: 'bg-orange-100 text-orange-600',
								title: "Tax Optimization",
								details: [
									"Legal tax savings",
									"Strategic planning",
									"Compliance assured",
									"Maximum benefits",
								],
							},
						].map((item: any, i) => (
							<motion.div key={i} variants={fadeInUp}>
								<ServiceCard icon={item.icon} title={item.title} details={item.details} iconColor={item.iconColor} />
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* Calculators Section */}
			<section className="py-16">
				<motion.div
					className="container max-w-7x1 mx-auto px-4"
					initial="initial"
					whileInView="animate"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<motion.div
						className="text-center mb-12"
						variants={fadeInUp}
					>
						<h2 className="text-4xl font-bold mb-4 text-black">Our Tools & Calculators</h2>
						<p className="text-lg text-gray-700 max-w-2xl mx-auto">
							Free, easy-to-use tools to handle all your tax calculations
						</p>
					</motion.div>					<motion.div
						className="grid md:grid-cols-4 gap-6  mx-auto"
						variants={staggerContainer}
					>
						{[
							{
								title: "Income Tax",
								description: "Estimate your annual income tax liability accurately.",
								href: "/calculators#income-tax",
								icon: <DollarSign className="w-6 h-6 text-indigo-600" />,
								details: [
									"Compare new vs. old tax regimes",
									"Includes standard deductions & exemptions",
									"Automatic slab-based calculation",
									"Instant liability estimate with summary",
								],
							},
							{
								title: "GST",
								description: "Calculate GST liabilities and rate breakdowns for transactions.",
								href: "/calculators#gst",
								icon: <ReceiptText className="w-6 h-6 text-rose-600" />,
								details: [
									"Intra-state & inter-state handling",
									"Multi-rate and HSN support",
									"Real-time tax breakdowns",
									"Input tax credit calculations",
								],
							},
							{
								title: "HRA",
								description: "Compute HRA exemption and optimize rent-based deductions.",
								href: "/calculators#hra",
								icon: <HomeIcon className="w-6 h-6 text-red-600" />,
								details: [
									"Metro vs non-metro exemption rules",
									"Rent receipt & proof guidance",
									"Annual exemption summary",
									"Maximization suggestions",
								],
							},
							{
								title: "TDS",
								description: "Accurately compute TDS for salaries and payments.",
								href: "/calculators#tds",
								icon: <BarChart3 className="w-6 h-6 text-teal-600" />,
								details: [
									"Coverage across major TDS sections",
									"Applicable rates for FY 2025–26",
									"Quarterly deposit & return estimates",
									"Annual deduction summaries",
								],
							},
						].map((calc, i) => (
							<motion.div key={i} variants={fadeInUp}>
								<CalculatorCard {...calc} />
							</motion.div>
						))}
					</motion.div>
					{/* <motion.div
						className="grid grid-cols-2 gap-6 max-w-3xl mx-auto mt-6"
						variants={staggerContainer}
					>
						{[
							
							{
								title: "GST Search",
								description: "Lookup GSTIN details and verify basic compliance.",
								href: "/calculators/gst-search",
								icon: <Search className="w-6 h-6 text-lime-600" />,
								details: [
									"Real-time GSTIN validation",
									"Business status & registration data",
									"Return filing status overview",
									"Basic compliance indicators",
								],
							},
						].map((calc, i) => (
							<motion.div key={i} variants={fadeInUp}>
								<CalculatorCard {...calc} />
							</motion.div>
						))}
					</motion.div> */}
				</motion.div>
			</section>

			{/* Services Section */}
			<section className="py-16 border-b">
				<motion.div
					className="container max-w-7xl mx-auto px-4 text-center "
					initial="initial"
					whileInView="animate"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<motion.div
						className="text-center mb-12"
						variants={fadeInUp}
					>
						<h2 className="text-4xl font-bold mb-4">Our Services</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Comprehensive tax and compliance services for individuals and businesses
						</p>

					</motion.div>

					<ServicesPreview />
				</motion.div>
			</section>

			{/* FAQ Section */}
			<section className="py-16 border-b">
				<motion.div
					className="container max-w-7xl mx-auto px-4"
					initial="initial"
					whileInView="animate"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<motion.div
						className="text-center mb-12"
						variants={fadeInUp}
					>
						<h2 className="text-4xl font-bold mb-4 text-black" id="faq">
							Frequently Asked Questions
						</h2>
					</motion.div>					<motion.div
						className="max-w-3xl mx-auto"
						variants={fadeInUp}
					>
						<FAQ items={faqItems} />
					</motion.div>
				</motion.div>
			</section>

			{/* CTA Section */}
			<CTASection />
		</div>
	)
}

