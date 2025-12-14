import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  details?: string[]
  iconColor?: string
}

export function ServiceCard({ icon: Icon, title, details, iconColor = 'bg-primary/10 text-primary' }: ServiceCardProps) {
  return (
    <Card className="group card-shadow hover:shadow-lg transition-all duration-300 h-full hover:border-primary flex flex-col bg-white">
      <CardHeader className="pb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <CardTitle className="text-lg font-semibold text-left">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
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
        <div className="w-full overflow-hidden max-h-0 group-hover:max-h-28 transition-all duration-300">
          <Link href="/aboutus#contact-form-section" className="w-full block mt-3">
            <Button className="w-full bg-primary text-white hover:bg-primary/90 transform transition-all duration-300">
              Enquire Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

