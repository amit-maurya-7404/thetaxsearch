import React from "react"

interface Props {
  rates?: Array<number | string>
  value?: number | string | null
  onChange?: (v: number | string) => void
}

export function RateSelector({ rates = [0, 5, 12, 18, 28, "Custom"], value = null, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {rates.map((r) => {
        const key = String(r)
        const selected = value !== null && String(value) === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange && onChange(r)}
            className={`rounded-xl p-6 text-center border transition-all duration-200 select-none ${selected ? "bg-gradient-to-r from-primary to-indigo-400 text-white shadow-2xl transform scale-105" : "bg-white border-slate-200 text-slate-900 hover:scale-105 hover:shadow-md"}`}
          >
            <div className="text-xl font-semibold">{key}%</div>
            <div className="text-xs text-slate-400 mt-1">{typeof r === "number" ? (r === 0 ? "Exempt" : "Rate") : String(r)}</div>
          </button>
        )
      })}
    </div>
  )
}

export default RateSelector
