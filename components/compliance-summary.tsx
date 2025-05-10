import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface Rule {
  id: string
  title: string
  source: string
  category: string
  status: string
}

interface ComplianceSummaryProps {
  rules: Rule[]
}

export function ComplianceSummary({ rules }: ComplianceSummaryProps) {
  // Count rules by category
  const categoryCounts = rules.reduce((acc: Record<string, number>, rule) => {
    acc[rule.category] = (acc[rule.category] || 0) + 1
    return acc
  }, {})

  const categories = [
    {
      name: "Privacy",
      count: categoryCounts.privacy || 0,
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      name: "Consumer",
      count: categoryCounts.consumer || 0,
      icon: <Info className="h-5 w-5 text-green-500" />,
      color: "bg-green-50 border-green-200",
    },
    {
      name: "Security",
      count: categoryCounts.security || 0,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      color: "bg-red-50 border-red-200",
    },
    {
      name: "Safety",
      count: categoryCounts.safety || 0,
      icon: <CheckCircle className="h-5 w-5 text-yellow-500" />,
      color: "bg-yellow-50 border-yellow-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card key={category.name} className={`border ${category.color} shadow-sm hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {category.icon}
                <h3 className="ml-2 text-sm font-medium">{category.name}</h3>
              </div>
              <div className="text-2xl font-bold">{category.count}</div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {category.count} active rule{category.count !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
