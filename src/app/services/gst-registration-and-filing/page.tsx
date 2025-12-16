import React from 'react'
import Link from 'next/link'
import { FileText, CheckCircle, BarChart3, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { CTASection } from '@/components/CTAButtons'

export default function GSTRegistrationAndFilingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <section className="relative bg-gradient-to-br from-primary/10 to-white py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">GST Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              From registration to returns filing and reconciliation, we ensure your GST compliance is 100% accurate and timely.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/aboutus#contact-form-section"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-200"
              >
                Get GST Registered
              </Link>
              {/* <button className="bg-white text-emerald-600 border border-emerald-200 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition">
                View Plans
              </button> */}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2x1 font-bold text-primary uppercase tracking-wide mb-2">What We Offer</h2>
            <h3 className="text-3xl font-bold text-slate-900">End-to-End GST Services</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard 
              icon={<FileText className="w-8 h-8 text-violet-600" />}
              title="GST Registration"
              desc="Quick and hassle-free GST registration for new businesses with complete documentation support."
            />
            <ServiceCard 
              icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
              title="Monthly Return Filing"
              desc="Timely GSTR-1, GSTR-3B, and annual return filing to ensure zero penalty compliance."
            />
            <ServiceCard 
              icon={<TrendingUp className="w-8 h-8 text-cyan-600" />}
              title="ITC Reconciliation"
              desc="Input Tax Credit optimization and reconciliation to maximize eligible claims."
            />
            <ServiceCard 
              icon={<ShieldCheck className="w-8 h-8 text-rose-600" />}
              title="HSN/SAC Advisory"
              desc="Expert classification and rate advisory to avoid disputes and ensure correct GST compliance."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why choose TheTaxSearch for GST?</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Our GST experts ensure your business stays audit-ready with timely filings, accurate reconciliations, and proactive compliance strategies.
              </p>
              <div className="space-y-4">
                <FeatureItem text="Timely filing & zero penalties" />
                <FeatureItem text="ITC optimization strategies" />
                <FeatureItem text="Expert notice & appeal handling" />
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Expert Support</h4>
                    <p className="text-sm text-slate-500">Dedicated GST specialist</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-4/5"></div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-slate-500">Compliance Rate</span>
                  <span className="font-bold text-primary">99% Accurate</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Our Process</h2>
            <p className="text-slate-600 mt-2">How we ensure your GST compliance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

            <Step 
              number="01"
              title="Registration"
              desc="Complete GST registration with all documentation."
            />
            <Step 
              number="02"
              title="Setup"
              desc="Configure your accounting system for GST."
            />
            <Step 
              number="03"
              title="Filing"
              desc="Monthly/quarterly returns filing on time."
            />
            <Step 
              number="04"
              title="Audit"
              desc="Regular compliance check & optimization."
            />
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-slateDark text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Simplify your GST compliance today</h2>
          <p className="text-emerald-200 mb-8 max-w-2xl mx-auto">Let our GST experts handle everything so you can focus on growing your business.</p>
          <button className="bg-white text-slateDark px-8 py-3 rounded-lg font-bold hover:bg-primary/10 transition">
            Get Started
          </button>
        </div>
      </section> */}

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
      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto md:mx-0 shadow-md">
        {number}
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  )
}
