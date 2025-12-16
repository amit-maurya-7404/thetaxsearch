import React from 'react'
import Link from 'next/link'
import { CheckCircle, FileText, ShieldCheck, Users, TrendingUp, BarChart3 } from 'lucide-react'
import { CTASection } from '@/components/CTAButtons'

export default function CharityRegistrationsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <section className="relative bg-gradient-to-br from-primary/10 to-white py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">NGO or Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Get 12A & 80G registrations to unlock tax-exempt status and enable donors to claim deductions on contributions.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/aboutus#contact-form-section" className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-200">
                Apply for Registration
              </Link>
              {/* <button className="bg-white text-emerald-600 border border-emerald-200 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition">
                View Process
              </button> */}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2x1 font-bold text-primary uppercase tracking-wide mb-2">What We Offer</h2>
            <h3 className="text-3xl font-bold text-slate-900">Complete 12A & 80G Solutions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard 
              icon={<FileText className="w-8 h-8 text-fuchsia-600" />}
              title="12A Registration"
              desc="Complete application process for charitable status recognition under Section 12A of Income Tax Act."
            />
            <ServiceCard 
              icon={<CheckCircle className="w-8 h-8 text-rose-600" />}
              title="80G Certification"
              desc="Enable donors to claim tax deductions (80G) on their contributions to your organization."
            />
            <ServiceCard 
              icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
              title="Documentation & Filing"
              desc="We prepare all required documents, forms and responses for authorities to fast-track approvals."
            />
            <ServiceCard 
              icon={<TrendingUp className="w-8 h-8 text-cyan-600" />}
              title="Annual Compliance"
              desc="Post-registration support including annual returns, filings and compliance management."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why 12A & 80G registration matters</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                12A and 80G registrations are critical for NGOs and trusts to attract donor support and operate with credibility. Our expertise ensures smooth approvals and helps you build a strong charitable presence.
              </p>
              <div className="space-y-4">
                <FeatureItem text="Fast-track approvals with complete documentation" />
                <FeatureItem text="Authority follow-up and query resolution" />
                <FeatureItem text="Ongoing compliance and renewal support" />
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-fuchsia-100 rounded-lg">
                    <Users className="w-6 h-6 text-fuchsia-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Compliance Expert</h4>
                    <p className="text-sm text-slate-500">Your dedicated NGO/Trust advisor</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-4/5"></div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-slate-500">Approval Time</span>
                  <span className="font-bold text-primary">3-4 Months Avg</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Registration Process</h2>
            <p className="text-slate-600 mt-2">How we help you get registered</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

            <Step 
              number="01"
              title="Assessment"
              desc="Evaluate your eligibility for 12A & 80G."
            />
            <Step 
              number="02"
              title="Documentation"
              desc="Prepare all required forms and supporting documents."
            />
            <Step 
              number="03"
              title="Filing"
              desc="Submit applications to tax authorities."
            />
            <Step 
              number="04"
              title="Follow-up"
              desc="Handle queries and obtain final registrations."
            />
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white group">
      <div className="mb-6 p-4 bg-primary/10 rounded-xl w-fit transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center md:text-left">
      <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto md:mx-0 shadow-md">
        {number}
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  )
}
