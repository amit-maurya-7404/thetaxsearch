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
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
				"Our calculators are based on current Indian tax laws and regulations (FY 2024-25). However, for precise calculations and personalized advice, we recommend consulting with our tax experts.",
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
				"We provide comprehensive tax compliance services including GST registration & returns, Income Tax filing, TDS payments, HRA calculations, and much more. Visit our Services page to learn more.",
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
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
								Tax Compliance
							</span>
						</h1>
						<p className="text-lg text-gray-700 mb-8 leading-relaxed">
							Simplify your tax journey with our comprehensive calculators, expert guidance, and
							professional services. From GST to Income Tax, we've got you covered.
						</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/#consultation">
									<Button size="lg" className="w-full sm:w-auto">
										Book Free Consultation
									</Button>
								</Link>
								<Link href="/calculators/income-tax">
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
										{ label: "Income Tax", value: "100K+" },
										{ label: "GST Returns", value: "50K+" },
										{ label: "Users", value: "250K+" },
										{ label: "Tax Saved", value: "₹50Cr+" },
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
								title: "Smart Calculators",
								description: "Advanced calculators that save you hours of manual calculations",
							},
							{
								icon: Users,
								title: "Expert Team",
								description: "Qualified tax professionals ready to assist you",
							},
							{
								icon: TrendingUp,
								title: "Tax Optimization",
								description: "Strategies to minimize tax liability legally",
							},
						].map((item, i) => (
							<motion.div key={i} variants={fadeInUp}>
								<ServiceCard icon={item.icon} title={item.title} description={item.description} />
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* Calculators Section */}
			<section className="py-16">
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
					<h2 className="text-4xl font-bold mb-4 text-black">Our Tools & Calculators</h2>
					<p className="text-lg text-gray-700 max-w-2xl mx-auto">
						Free, easy-to-use tools to handle all your tax calculations
					</p>
				</motion.div>					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
						variants={staggerContainer}
					>
						{[
							{
								title: "Income Tax",
								description: "Calculate your income tax liability",
								href: "/calculators/income-tax",
								icon: <DollarSign className="w-6 h-6 text-primary" />,
							},
							{
								title: "GST",
								description: "GST calculator for businesses",
								href: "/calculators/gst",
								icon: <ReceiptText className="w-6 h-6 text-primary" />,
							},
							{
								title: "HRA",
								description: "Calculate HRA exemption",
								href: "/calculators/hra",
								icon: <HomeIcon className="w-6 h-6 text-primary" />,
							},
							{
								title: "TDS",
								description: "TDS calculation tool",
								href: "/calculators/tds",
								icon: <BarChart3 className="w-6 h-6 text-primary" />,
							},
							{
								title: "GST Search",
								description: "Search GST details",
								href: "/calculators/gst-search",
								icon: <Search className="w-6 h-6 text-primary" />,
							},
						].map((calc, i) => (
							<motion.div key={i} variants={fadeInUp}>
								<CalculatorCard {...calc} />
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* Services Section */}
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
						<h2 className="text-4xl font-bold mb-4">Our Services</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Comprehensive tax and compliance services for individuals and businesses
						</p>
						<Link href="/services" className="mt-6 inline-block">
							<Button variant="outline">View All Services</Button>
						</Link>
					</motion.div>

					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						variants={staggerContainer}
					>
						{[
							{
								icon: FileText,
								title: "GST Registration",
								description: "Easy GST registration for your business",
							},
							{
								icon: ReceiptText,
								title: "Income Tax Return",
								description: "Professional ITR filing services",
							},
							{
								icon: Clock,
								title: "TDS Payments",
								description: "Timely TDS payment and returns",
							},
						].map((service, i) => (
							<motion.div key={i} variants={fadeInUp}>
								<ServiceCard icon={service.icon} title={service.title} description={service.description} />
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* Latest Blog Posts */}
			<section className="py-16">
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
					<h2 className="text-4xl font-bold mb-4 text-black">Latest from Our Blog</h2>
					<p className="text-lg text-gray-700 max-w-2xl mx-auto">
						Stay updated with the latest tax news, tips, and guidelines
					</p>
				</motion.div>					<motion.div
						className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
						variants={staggerContainer}
					>
						{blogPosts.map((post, i) => (
							<motion.div key={i} variants={fadeInUp}>
								<BlogCard {...post} />
							</motion.div>
						))}
					</motion.div>

					<div className="text-center">
						<Link href="/blog">
							<Button variant="outline" size="lg">
								Read More Articles
							</Button>
						</Link>
					</div>
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

			{/* Contact Section */}
			{/* <section className="py-16">
				<motion.div
					className="container max-w-7xl mx-auto px-4"
					initial="initial"
					whileInView="animate"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
						variants={staggerContainer}
					>
						<motion.div variants={fadeInUp} id="consultation">
							<h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
							<p className="text-lg text-muted-foreground mb-8">
								Have questions? Our team is here to help. Reach out to us today for a free
								consultation.
							</p>

							<div className="space-y-6">
								{[
									{
										label: "Email",
										value: "info@thetaxsearch.com",
										href: "mailto:info@thetaxsearch.com",
									},
									{
										label: "Phone",
										value: "+91 98765 43210",
										href: "tel:+919876543210",
									},
									{
										label: "WhatsApp",
										value: "Chat with us",
										href: "https://wa.me/919876543210",
									},
								].map((contact, i) => (
									<div>
										<p className="text-sm text-gray-700 mb-1">{contact.label}</p>
										<a
											href={contact.href}
											target={contact.label === "WhatsApp" ? "_blank" : undefined}
											rel={contact.label === "WhatsApp" ? "noopener noreferrer" : undefined}
											className="text-primary hover:text-primary-dark font-semibold transition-colors"
										>
											{contact.value}
										</a>
									</div>
								))}
							</div>
						</motion.div>

						<motion.div
							variants={fadeInUp}
							className="bg-white border rounded-lg p-8"
						>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="text-sm font-medium mb-2 block">Name *</label>
									<Input
										required
										placeholder="Your name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
									/>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">Email *</label>
									<Input
										required
										type="email"
										placeholder="your@email.com"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
									/>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">Phone</label>
									<Input
										placeholder="+91 00000 00000"
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
									/>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">Message *</label>
									<Textarea
										required
										placeholder="Tell us how we can help..."
										value={formData.message}
										onChange={(e) =>
											setFormData({ ...formData, message: e.target.value })
										}
									/>
								</div>
								<Button type="submit" disabled={isSubmitting} className="w-full">
									{isSubmitting ? "Sending..." : "Send Message"}
								</Button>
							</form>
						</motion.div>
					</motion.div>
				</motion.div>
			</section> */}

			{/* CTA Section */}
			<CTASection />
		</div>
	)
}

