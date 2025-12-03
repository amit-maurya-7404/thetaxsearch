"use client"

import { motion } from "framer-motion"
import { ServiceCard } from "@/components/ServiceCard"
import { CTASection } from "@/components/CTAButtons"
import {
  FileText,
  ReceiptText,
  Clock,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Building2,
  Briefcase,
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

const services = [
  {
    icon: FileText,
    title: "GST Registration",
    description: "Complete GST registration assistance for businesses of all sizes",
  },
  {
    icon: ReceiptText,
    title: "GST Return Filing",
    description: "Hassle-free GST GSTR-1, GSTR-3B, and GSTR-9 return filing",
  },
  {
    icon: BarChart3,
    title: "GST Appeal / Notice Reply",
    description: "Expert assistance in handling GST notices and appeals",
  },
  {
    icon: DollarSign,
    title: "GST Refund (ITC)",
    description: "Maximize your Input Tax Credit and claim refunds",
  },
  {
    icon: FileText,
    title: "Income Tax Return Filing",
    description: "Professional ITR filing for individuals and businesses",
  },
  {
    icon: Clock,
    title: "TDS Payments & Returns",
    description: "Timely TDS calculations, payments, and annual returns",
  },
  {
    icon: BarChart3,
    title: "Balance Sheet & P&L Preparation",
    description: "Professional financial statement preparation",
  },
  {
    icon: Users,
    title: "EPFO Return & Withdrawal",
    description: "EPFO compliance and withdrawal assistance",
  },
  {
    icon: Building2,
    title: "ESIC Registration & Returns",
    description: "Complete ESIC compliance and filing services",
  },
  {
    icon: FileText,
    title: "ROC Filings",
    description: "AOC-4, MGT-7A, and other ROC compliance filings",
  },
  {
    icon: Briefcase,
    title: "Bookkeeping Services",
    description: "Professional accounting and bookkeeping services",
  },
  {
    icon: Building2,
    title: "MSME Registration",
    description: "Udyam registration and MSME benefits guidance",
  },
]

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          className="container max-w-7xl mx-auto px-4 relative z-10 text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Comprehensive <span className="text-primary">Tax Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From GST to Income Tax, we provide end-to-end solutions for all your tax compliance
              needs
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <motion.div
          className="container max-w-7xl mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            {services.map((service, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Why Our Services */}
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
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Services?</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
          >
            {[
              { icon: CheckCircle, title: "Expert Team", desc: "Qualified professionals" },
              { icon: TrendingUp, title: "Competitive Rates", desc: "Best prices in market" },
              { icon: Clock, title: "Quick Turnaround", desc: "Fast processing" },
              { icon: Users, title: "24/7 Support", desc: "Always available" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-background border rounded-lg p-6 text-center"
              >
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <CTASection />
    </div>
  )
}
