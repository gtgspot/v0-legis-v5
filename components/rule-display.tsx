"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { getRuleHistory } from "@/app/actions/rules"
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

type RuleHistoryEntry = {
  id?: string
  changeType?: string | null
  changeSummary?: string | null
  summary?: string | null
  changes?: unknown
  createdAt?: string | Date | null
  user?: {
    id?: string | null
    name?: string | null
  } | null
}

const getHistorySummary = (entry: RuleHistoryEntry) => {
  const summaryCandidates = [entry.changeSummary, entry.summary]

  for (const candidate of summaryCandidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate
    }
  }

  if (typeof entry.changes === "string" && entry.changes.trim().length > 0) {
    return entry.changes
  }

  if (entry.changes && typeof entry.changes === "object" && "summary" in entry.changes) {
    const summary = (entry.changes as { summary?: unknown }).summary

    if (typeof summary === "string" && summary.trim().length > 0) {
      return summary
    }
  }

  if (entry.changeType) {
    const normalized = entry.changeType.replace(/_/g, " ").trim()

    if (normalized) {
      return normalized.charAt(0).toUpperCase() + normalized.slice(1)
    }
  }

  return "Rule updated"
}

const formatHistoryTimestamp = (timestamp: RuleHistoryEntry["createdAt"]) => {
  if (!timestamp) {
    return "Unknown date"
  }

  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "Unknown date"
  }

  try {
    return format(date, "PPpp")
  } catch {
    return date.toLocaleString()
  }
}

const getHistoryUserName = (entry: RuleHistoryEntry) => {
  const name = entry.user?.name

  if (typeof name === "string" && name.trim().length > 0) {
    return name
  }

  return "Unknown user"
}

export function RuleDisplay({ rule }: { rule: Rule }) {
  const [expanded, setExpanded] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<RuleHistoryEntry[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
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

  useEffect(() => {
    if (!showHistory) {
      return
    }

    let isCancelled = false

    const fetchHistory = async () => {
      setIsHistoryLoading(true)
      setHistoryError(null)

      try {
        const result = await getRuleHistory(rule.id)

        if (isCancelled) {
          return
        }

        if (result.success) {
          const entries = Array.isArray(result.history) ? (result.history as RuleHistoryEntry[]) : []
          setHistory(entries)
        } else {
          setHistory([])
          setHistoryError(result.error ?? "Failed to fetch rule history")
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error loading rule history", error)
          setHistory([])
          setHistoryError("Failed to fetch rule history")
        }
      } finally {
        if (!isCancelled) {
          setIsHistoryLoading(false)
        }
      }
    }

    void fetchHistory()

    return () => {
      isCancelled = true
    }
  }, [rule.id, showHistory])

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
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label={expanded ? "Collapse rule details" : "Expand rule details"}
              onClick={() => setExpanded(!expanded)}
            >
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
                  {isHistoryLoading ? (
                    <p className="text-xs text-gray-500">Loading history...</p>
                  ) : historyError ? (
                    <p className="text-xs text-red-600">{historyError}</p>
                  ) : history.length === 0 ? (
                    <p className="text-xs text-gray-500">No history available for this rule.</p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item, index) => (
                        <div key={item.id ?? index} className="text-xs border-l-2 border-gray-300 pl-3 py-1">
                          <div className="font-medium">{formatHistoryTimestamp(item.createdAt)}</div>
                          <div className="text-gray-600">{getHistorySummary(item)}</div>
                          <div className="text-gray-500">By: {getHistoryUserName(item)}</div>
                        </div>
                      ))}
                    </div>
                  )}
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
