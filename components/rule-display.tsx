"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Info, Shield, Edit, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

interface Rule {
  id: string
  title: string
  source: string
  condition: string
  requirement: string
  consequence: string
  enforcement?: string
  category?: string
  status?: string
}

export function RuleDisplay({ rule }: { rule: Rule }) {
  const [expanded, setExpanded] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const router = useRouter()

  // Map rule categories to their respective styling
  const categoryMap: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
    privacy: {
      icon: <Shield className="h-5 w-5" />,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    consumer: {
      icon: <Info className="h-5 w-5" />,
      color: "text-green-700",
      bgColor: "bg-green-50",
    },
    security: {
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-700",
      bgColor: "bg-red-50",
    },
    safety: {
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
    },
  }

  const category = rule.category || "privacy"
  const { icon, color, bgColor } = categoryMap[category] || categoryMap.privacy

  // Mock rule history data
  const ruleHistory = [
    {
      date: "2025-04-20",
      user: "Sarah Chen",
      change: "Updated requirement to reflect new Privacy Act amendments",
    },
    {
      date: "2025-03-15",
      user: "David Wilson",
      change: "Added enforcement details",
    },
    {
      date: "2025-02-10",
      user: "System",
      change: "Rule created",
    },
  ]

  const handleEditRule = () => {
    // In a real implementation, this would navigate to the CMS rule editor
    router.push(`/cms?rule=${rule.id}`)
  }

  return (
    <Card
      className={`shadow-sm hover:shadow transition-shadow border-l-4 ${expanded ? "border-l-emerald-500" : "border-l-gray-300"}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Badge className={`mr-2 ${bgColor} ${color} border-0`}>{rule.id}</Badge>
            <CardTitle className="text-lg">{rule.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleEditRule}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Rule</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Rule</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center">
          <span className="mr-2">Source:</span>
          <Badge variant="outline" className="font-normal">
            {rule.source}
          </Badge>
          <Button variant="link" size="sm" className="h-6 p-0 ml-2">
            <ExternalLink className="h-3 w-3 mr-1" />
            <span className="text-xs">View Source</span>
          </Button>
        </CardDescription>
      </CardHeader>

      <CardContent
        className={`pb-2 grid gap-4 transition-all duration-200 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className={`overflow-hidden transition-all duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-2">
            <div className="rounded-md bg-gray-50 p-3 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                Condition
              </h3>
              <code className="mt-2 text-sm text-gray-700 block bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                {rule.condition}
              </code>
            </div>

            <div className="rounded-md bg-gray-50 p-3 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Requirement
              </h3>
              <code className="mt-2 text-sm text-gray-700 block bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                {rule.requirement}
              </code>
            </div>

            <div className="rounded-md bg-gray-50 p-3 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Consequence
              </h3>
              <p className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                {rule.consequence}
              </p>
            </div>
          </div>

          {expanded && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="text-sm">
                {showHistory ? "Hide History" : "Show Rule History"}
              </Button>

              {showHistory && (
                <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Rule History</h4>
                  <div className="space-y-2">
                    {ruleHistory.map((item, index) => (
                      <div key={index} className="text-xs border-l-2 border-gray-300 pl-3 py-1">
                        <div className="font-medium">{item.date}</div>
                        <div className="text-gray-600">{item.change}</div>
                        <div className="text-gray-500">By: {item.user}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {rule.enforcement && expanded && (
        <CardFooter className="text-sm text-gray-600 pt-2 pb-4 border-t mt-2">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
            <div>
              <strong className="font-medium">Enforcement:</strong> {rule.enforcement}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
