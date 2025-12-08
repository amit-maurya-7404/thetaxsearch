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
    title: "Income Tax Return (ITR)",
    details: [
      "Salaried Individuals (ITR-1)",
      "Business & Profession (ITR-3, 4)",
      "Capital Gains Analysis",
      "Notice Handling",
    ],
  },
  {
    icon: ReceiptText,
    title: "GST Compliance",
    details: [
      "New Registration",
      "Monthly Return Filing (GSTR-1, 3B)",
      "Annual Return (GSTR-9)",
      "LUT Filing",
    ],
  },
  {
    icon: Building2,
    title: "ROC & Company Law",
    details: [
      "Private Limited Incorporation",
      "LLP Registration",
      "Annual Filing (AOC-4, MGT-7)",
      "Director KYC",
    ],
  },
  {
    icon: Users,
    title: "Payroll & Labour Law",
    details: [
      "PF & ESIC Registration",
      "Monthly Challan Generation",
      "Employee Tax Planning",
      "Payroll Processing",
    ],
  },
  {
    icon: TrendingUp,
    title: "MSME & Startup",
    details: [
      "Udyam Registration",
      "Startup India Recognition",
      "Trademark Filing",
      "Project Reports",
    ],
  },
  {
    icon: BarChart3,
    title: "Accounting Services",
    details: [
      "Bookkeeping",
      "Balance Sheet Finalization",
      "Profit & Loss Account",
      "Cash Flow Statements",
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/40 to-background pt-10 md:pt-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
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
              { 
                icon: CheckCircle, 
                title: "Expert Team", 
                details: [
                  "Qualified professionals",
                  "15+ years experience",
                  "CA & Certified experts",
                  "Industry specialists",
                ]
              },
              { 
                icon: TrendingUp, 
                title: "Competitive Rates", 
                details: [
                  "Best prices in market",
                  "Transparent pricing",
                  "No hidden charges",
                  "Flexible packages",
                ]
              },
              { 
                icon: Clock, 
                title: "Quick Turnaround", 
                details: [
                  "Fast processing",
                  "Quick compliance",
                  "Timely filings",
                  "Instant support",
                ]
              },
              { 
                icon: Users, 
                title: "24/7 Support", 
                details: [
                  "Always available",
                  "Quick response time",
                  "Multiple channels",
                  "Dedicated support",
                ]
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
              >
                <ServiceCard icon={item.icon} title={item.title} details={item.details} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <CTASection />
    </div>
  )
}
