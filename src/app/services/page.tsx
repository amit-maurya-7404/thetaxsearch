"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CTASection } from "@/components/CTAButtons"
import {
  FileText,
  ReceiptText,
  Clock,
  BarChart3,
  Users,
  Star,
  TrendingUp,
  CheckCircle,
  Building2,
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

import { services } from '@/lib/services'

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
              Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Tax Services</span>
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
              <Link href={`/services/${service.slug}`} key={i}>
                <motion.div id={service.slug} variants={fadeInUp}>
                  <ServiceCardClickable {...service} />
                </motion.div>
              </Link>
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
                iconColor: 'bg-cyan-100 text-cyan-600',
                title: "Expert Team",
                details: [
                  "Qualified professionals",
                  "15+ years experience",
                  "CA & Certified experts",
                  "Industry specialists",
                ],
              },
              {
                icon: TrendingUp,
                iconColor: 'bg-yellow-100 text-yellow-600',
                title: "Competitive Rates",
                details: [
                  "Best prices in market",
                  "Transparent pricing",
                  "No hidden charges",
                  "Flexible packages",
                ],
              },
              {
                icon: Clock,
                iconColor: 'bg-red-100 text-red-600',
                title: "Quick Turnaround",
                details: [
                  "Fast processing",
                  "Quick compliance",
                  "Timely filings",
                  "Instant support",
                ],
              },
              {
                icon: Star,
                iconColor: 'bg-amber-100 text-amber-600',
                title: "Customer Rating",
                details: [
                  "4.9/5 average",
                  "Based on 1.2k+ reviews",
                  "Excellent customer satisfaction",
                  "Trusted by clients",
                ],
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
              >
                <ServiceCardClickable icon={item.icon} title={item.title} details={item.details} iconColor={item.iconColor} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <CTASection />
    </div>
  )
}

function ServiceCardClickable({ icon: Icon, title, details, iconColor = 'bg-primary/10 text-primary' }: { icon: any; title: string; details?: string[]; iconColor?: string }) {
  return (
    <div className="card-shadow hover:shadow-lg transition-all duration-300 h-full hover:border-primary hover:cursor-pointer hover:-translate-y-1 flex flex-col bg-white border rounded-lg p-6">
      <div className="pb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-left">{title}</h3>
      </div>
      <div className="flex-1 flex flex-col">
        {details && details.length > 0 && (
          <ul className="space-y-2 mb-6 flex-1">
            {details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary font-bold">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
