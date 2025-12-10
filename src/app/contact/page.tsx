"use client"

import { motion } from "framer-motion"
import { ContactForm } from "@/components/ContactForm"
import { Heart, Target, Users, Zap } from "lucide-react"

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

export default function ContactPage() {
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
              About <span className="text-primary">theTaxSearch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're a team of experienced tax professionals dedicated to simplifying tax compliance for businesses and individuals.
            </p>
            {/* <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about our tax services? We're here to help and answer any questions you might have.
            </p> */}
          </motion.div>
        </motion.div>
      </section>


      {/* About Us Section */}
      <section className="py-20 border-y">
        <motion.div
          className="container max-w-7xl mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-0"
            variants={fadeInUp}
          >
            {/* <h2 className="text-4xl md:text-5xl font-bold mb-0">
              About <span className="text-primary">theTaxSearch</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We're a team of experienced tax professionals dedicated to simplifying tax compliance for businesses and individuals.
            </p> */}
          </motion.div>

          {/* Mission & Values */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            variants={staggerContainer}
          >
            {[
              {
                icon: Target,
                title: "Our Mission",
                desc: "To make tax compliance simple, affordable, and accessible to everyone",
              },
              {
                icon: Heart,
                title: "Our Values",
                desc: "Integrity, transparency, and commitment to excellence in every interaction",
              },
              {
                icon: Zap,
                title: "Innovation",
                desc: "We use latest tools and technology to streamline tax processes",
              },
              {
                icon: Users,
                title: "Customer Focus",
                desc: "Your success is our success. We're here to support your growth",
              },
            ].map((item: any, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-background border rounded-lg p-6 text-center hover:border-primary transition-colors"
              >
                <item.icon className={`w-10 h-10 mx-auto mb-3 ${item.iconColor === 'cyan' ? 'text-cyan-600' : item.iconColor === 'yellow' ? 'text-yellow-600' : item.iconColor === 'red' ? 'text-red-600' : 'text-emerald-600'}`} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* About Content */}
          <motion.div
            className="max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <div className="bg-background border rounded-lg p-8 md:p-12">
              <h3 className="text-2xl font-semibold mb-4">Who We Are</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                theTaxSearch is a leading tax compliance and advisory firm with a team of certified tax professionals, chartered accountants, and financial experts. With over a decade of combined experience, we've helped thousands of businesses and individuals navigate the complexities of Indian tax laws.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">What We Do</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We provide comprehensive tax services including:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Income Tax planning and filing for individuals and businesses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>GST registration, return filing, and compliance assistance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>TDS management and return preparation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Financial bookkeeping and accounting services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Tax advisory and strategic planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Hassle-free Company and LLP formation with complete legal compliance</span>
                </li>
                
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Why Choose Us</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our commitment to excellence, attention to detail, and client-centric approach sets us apart. We combine traditional expertise with modern technology to deliver efficient, cost-effective solutions. Whether you're a startup, small business, or established enterprise, we have the expertise to support your tax needs.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
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
            <h2 className="text-4xl font-bold mb-4 text-black">Meet Our Team</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">Seasoned tax professionals and chartered accountants ready to help.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={staggerContainer}
          >
            {[
              { name: "Amit Maurya", role: "Founder & Tax Expert", bio: "15+ years experience in tax planning and corporate advisory." },
              { name: "Priya Sharma", role: "GST Specialist", bio: "Expert in GST compliance, registrations and returns." },
              { name: "Rohit Verma", role: "Senior CA", bio: "Income tax filings, audits and tax planning for businesses." },
              { name: "Sneha Gupta", role: "TDS & Payroll Expert", bio: "Payroll, TDS compliance and employer advisory." },
              { name: "Rahul Singh", role: "HRA & Advisory", bio: "HRA exemptions, housing tax planning and employee benefits." },
            ].map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                className="bg-background border rounded-lg p-6 text-center"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-xl font-semibold text-slate-700 mb-4">
                  {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <motion.div
          className="container max-w-7xl mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          <ContactForm />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <motion.div
          className="container max-w-7xl mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1500+", label: "Happy Clients" },
              { number: "5+", label: "Years of Experience" },
              { number: "13.5Cr+", label: "Tax Filed" },
              { number: "24/7", label: "Customer Support" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
