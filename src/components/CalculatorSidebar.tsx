import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	DollarSign,
	Home as HomeIcon,
	BarChart3,
	ReceiptText,
	Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CalculatorSidebarProps {
	currentCalculator?: "income-tax" | "gst" | "hra" | "tds" | "gst-search"
	horizontal?: boolean
}

export function CalculatorSidebar({ currentCalculator, horizontal = false }: CalculatorSidebarProps) {
	const calculators = [
		{
			title: "Income Tax",
			description: "Calculate tax liability",
			href: "/calculators/income-tax",
			icon: <DollarSign className="w-5 h-5" />,
			id: "income-tax",
		},
		{
			title: "GST",
			description: "GST calculations",
			href: "/calculators/gst",
			icon: <ReceiptText className="w-5 h-5" />,
			id: "gst",
		},
		{
			title: "HRA",
			description: "HRA exemption",
			href: "/calculators/hra",
			icon: <HomeIcon className="w-5 h-5" />,
			id: "hra",
		},
		{
			title: "TDS",
			description: "TDS calculation",
			href: "/calculators/tds",
			icon: <BarChart3 className="w-5 h-5" />,
			id: "tds",
		},
		{
			title: "GST Search",
			description: "Verify GSTIN",
			href: "/calculators/gst-search",
			icon: <Search className="w-5 h-5" />,
			id: "gst-search",
		},
	]

	if (horizontal) {
		return (
			<nav aria-label="Other calculators" className="w-full">
				<div className="flex gap-3 overflow-x-auto py-2">
					{calculators.map((calc) => {
						const isCurrent = currentCalculator === calc.id
						return (
							<Link
								key={calc.id}
								href={calc.href}
								className={cn(
									"flex-shrink-0 px-4 py-2 rounded-full border transition-all whitespace-nowrap",
									isCurrent
										? "bg-primary text-white shadow-lg font-semibold"
										: "bg-white text-slate-700 border-slate-200 hover:shadow"
								)}
							>
								{calc.title}
							</Link>
						)
					})}
				</div>
			</nav>
		)
	}

	return (
		<aside className="space-y-4">
			<Card className="sticky top-20">
				<CardHeader>
					<CardTitle className="text-lg">Other Calculators</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{calculators.map((calc) => {
						const isCurrent = currentCalculator === calc.id
						return (
							<Link
								key={calc.id}
								href={calc.href}
								className={cn(
									"flex items-start gap-3 p-3 rounded-lg transition-colors",
									isCurrent
										? "bg-primary/20 border border-primary text-primary font-semibold"
										: "hover:bg-gray-100 border border-transparent hover:border-gray-300"
								)}
							>
								<div className={cn(
									"mt-1 flex-shrink-0",
									isCurrent ? "text-primary" : "text-muted-foreground"
								)}>
									{calc.icon}
								</div>
								<div className="min-w-0 flex-1">
									<p className="font-medium text-sm leading-tight">{calc.title}</p>
									<p className={cn(
										"text-xs leading-tight",
										isCurrent ? "text-primary/70" : "text-muted-foreground"
									)}>
										{calc.description}
									</p>
								</div>
							</Link>
						)
					})}
				</CardContent>
			</Card>
		</aside>
	)
}
