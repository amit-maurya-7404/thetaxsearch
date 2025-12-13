import React from 'react'
import { FileText, CheckCircle, BarChart3, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { CTASection } from '@/components/CTAButtons'

export default function IncomeTexReturnFilingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <section className="relative bg-gradient-to-br from-primary/10 to-white py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Stress-Free <span className="text-primary">Income Tax Return Filing</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              From ITR-1 to ITR-6, we handle your tax return filing with precision to maximize deductions and minimize your tax liability.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg">
                Get Your ITR Ready
              </button>
              <button className="bg-white text-emerald-600 border border-emerald-200 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-2">What We Offer</h2>
            <h3 className="text-3xl font-bold text-slate-900">Comprehensive Income Tax Services</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard 
              icon={<FileText className="w-8 h-8 text-violet-600" />}
              title="ITR Preparation"
              desc="Accurate ITR filing for individuals, professionals, businesses with complete documentation support."
            />
            <ServiceCard 
              icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
              title="Deduction Optimization"
              desc="Maximize your eligible deductions under 80C, 80D, 80E, 80TTA and other sections for reduced tax liability."
            />
            <ServiceCard 
              icon={<TrendingUp className="w-8 h-8 text-cyan-600" />}
              title="Capital Gains Planning"
              desc="Expert guidance on long-term & short-term capital gains, indexation benefits, and tax-efficient investments."
            />
            <ServiceCard 
              icon={<ShieldCheck className="w-8 h-8 text-rose-600" />}
              title="Notice & Appeal Support"
              desc="Professional representation in income tax notices, queries, and appeals for best outcomes."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why choose TheTaxSearch?</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Our CA-led team ensures your ITR is not just compliant but optimized to save you the maximum tax. With 15+ years of experience, we know every nuance of the tax code.
              </p>
              <div className="space-y-4">
                <FeatureItem text="Timely filing & zero missed deadlines" />
                <FeatureItem text="Maximum deduction claims validated" />
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
                    <h4 className="font-bold text-slate-900">Dedicated CA</h4>
                    <p className="text-sm text-slate-500">Personal tax expert for you</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-4/5"></div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-slate-500">Tax Savings Avg</span>
                  <span className="font-bold text-primary">18% More Benefits</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Engagement Process</h2>
            <p className="text-slate-600 mt-2">How we work with you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

            <Step 
              number="01"
              title="Gather"
              desc="Collect your income, investments & expense details."
            />
            <Step 
              number="02"
              title="Optimize"
              desc="Identify all eligible deductions & tax benefits."
            />
            <Step 
              number="03"
              title="File"
              desc="Prepare & file your ITR before the deadline."
            />
            <Step 
              number="04"
              title="Support"
              desc="Handle any queries or notices from IT department."
            />
          </div>
        </div>
      </section>

    {/* //   <section className="py-16 bg-slateDark text-white text-center">
    //     <div className="container mx-auto px-6">
    //       <h2 className="text-3xl font-bold mb-4">Ready to file your taxes smartly?</h2>
    //       <p className="text-emerald-200 mb-8 max-w-2xl mx-auto">Let us handle the complexity so you can relax knowing your ITR is compliant and optimized.</p>
    //       <button className="bg-white text-slateDark px-8 py-3 rounded-lg font-bold hover:bg-primary/10 transition">
    //         Schedule Consultation
    //       </button>
    //     </div>
    //   </section> */}

      <CTASection />

    </div>
  )
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white group">
      <div className="mb-6 p-4 bg-primary/10 rounded-xl w-fit group-hover:bg-primary group-hover:text-white transition-colors duration-300">
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
