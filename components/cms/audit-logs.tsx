"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Search, FileText, User, Shield, Settings, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

export function AuditLogs() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [actionType, setActionType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock audit log data
  const auditLogs = [
    {
      id: "log-001",
      timestamp: "2025-04-23T09:15:22",
      user: "Sarah Chen",
      action: "rule_update",
      details: "Updated rule PRIV-01: Data Must Be Handled Lawfully",
      ip: "192.168.1.45",
      severity: "info",
    },
    {
      id: "log-002",
      timestamp: "2025-04-23T08:30:00",
      user: "System",
      action: "compliance_check",
      details: "Automated compliance check completed - 98% compliance score",
      ip: "10.0.0.1",
      severity: "info",
    },
    {
      id: "log-003",
      timestamp: "2025-04-22T16:45:12",
      user: "Admin",
      action: "user_add",
      details: "Added new compliance officer: Michael Johnson",
      ip: "192.168.1.22",
      severity: "info",
    },
    {
      id: "log-004",
      timestamp: "2025-04-22T14:22:05",
      user: "David Wilson",
      action: "rule_create",
      details: "Created new rule CONSUMER-02 for misleading AI outputs",
      ip: "192.168.1.30",
      severity: "info",
    },
    {
      id: "log-005",
      timestamp: "2025-04-22T10:15:33",
      user: "Sarah Chen",
      action: "login_failed",
      details: "Failed login attempt",
      ip: "203.0.113.42",
      severity: "warning",
    },
    {
      id: "log-006",
      timestamp: "2025-04-21T15:30:22",
      user: "System",
      action: "system_update",
      details: "Framework updated to version 1.0.42",
      ip: "10.0.0.1",
      severity: "info",
    },
    {
      id: "log-007",
      timestamp: "2025-04-21T11:05:18",
      user: "Unknown",
      action: "unauthorized_access",
      details: "Attempted access to restricted API endpoint",
      ip: "198.51.100.73",
      severity: "critical",
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-AU", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date)
  }

  // Filter logs based on search, date, and action type
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = searchTerm
      ? log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    const matchesDate = date ? new Date(log.timestamp).toDateString() === date.toDateString() : true

    const matchesAction = actionType !== "all" ? log.action === actionType : true

    return matchesSearch && matchesDate && matchesAction
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>Comprehensive record of all system activities</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search logs..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="rule_update">Rule Updates</SelectItem>
                <SelectItem value="rule_create">Rule Creation</SelectItem>
                <SelectItem value="compliance_check">Compliance Checks</SelectItem>
                <SelectItem value="user_add">User Management</SelectItem>
                <SelectItem value="login_failed">Login Failures</SelectItem>
                <SelectItem value="unauthorized_access">Security Events</SelectItem>
              </SelectContent>
            </Select>
            {(date || actionType !== "all" || searchTerm) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setDate(undefined)
                  setActionType("all")
                  setSearchTerm("")
                }}
                className="px-3"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-start">
                <div
                  className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                    log.severity === "critical"
                      ? "bg-red-100 text-red-600"
                      : log.severity === "warning"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {log.action.includes("rule") && <FileText className="h-5 w-5" />}
                  {log.action.includes("user") && <User className="h-5 w-5" />}
                  {log.action.includes("compliance") && <Shield className="h-5 w-5" />}
                  {log.action.includes("system") && <Settings className="h-5 w-5" />}
                  {(log.action.includes("login") || log.action.includes("unauthorized")) && (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-medium text-gray-900">{log.details}</div>
                    <div className="text-sm text-gray-500 mt-1 sm:mt-0">{formatDate(log.timestamp)}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">User:</span> {log.user}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">IP:</span> {log.ip}
                    </div>
                    <Badge
                      className={
                        log.severity === "critical"
                          ? "bg-red-100 text-red-800"
                          : log.severity === "warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {log.severity}
                    </Badge>
                    <Badge variant="outline">{log.action.replace("_", " ")}</Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500">No audit logs match your filters.</p>
              <Button
                variant="link"
                onClick={() => {
                  setDate(undefined)
                  setActionType("all")
                  setSearchTerm("")
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Audit Log Retention</h3>
              <p className="text-sm text-gray-700">
                All audit logs are retained for 7 years in compliance with Australian record-keeping requirements. Logs
                are immutable and cryptographically signed to ensure their integrity.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
