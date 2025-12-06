import React from "react"

interface Props {
  title: string
  subtitle?: string
  sidebar?: React.ReactNode
  children: React.ReactNode
}

export function CalculatorLayout({ title, subtitle, sidebar, children }: Props) {
  return (
    <div className="w-full min-h-screen bg-slate-900 text-white">
      {/* Top header / hero */}
      <header className="border-b border-slate-800 py-6">
        <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="opacity-70"> {/* placeholder for small icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#334155" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-24">{sidebar}</div>
            </aside>

            <section className="lg:col-span-2">
              <div className="space-y-6">
                {subtitle && (
                  <div className="mb-2">
                    <p className="text-sm text-slate-400">{subtitle}</p>
                  </div>
                )}

                <div>{children}</div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CalculatorLayout
