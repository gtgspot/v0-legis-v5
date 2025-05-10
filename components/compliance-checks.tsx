"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Database, User, Shield, ArrowRight, AlertTriangle, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ComplianceChecksProps {
  checks: {
    frequency: string
    logging: string
    auditing: string
    escalation_path: string[]
  }
}

export function ComplianceChecks({ checks }: ComplianceChecksProps) {
  const [lastChecked] = useState("2025-04-21T08:32:15")
  const [complianceScore] = useState(92)

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-AU", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Compliance Score</h3>
              <span
                className={`text-sm font-medium ${complianceScore >= 90 ? "text-emerald-600" : complianceScore >= 70 ? "text-amber-600" : "text-red-600"}`}
              >
                {complianceScore}%
              </span>
            </div>
            <Progress
              value={complianceScore}
              className="h-2 bg-gray-100"
              indicatorClassName={
                complianceScore >= 90 ? "bg-emerald-500" : complianceScore >= 70 ? "bg-amber-500" : "bg-red-500"
              }
            />
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Critical</span>
              <span>Compliant</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Last Checked</h3>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm">{formatDate(lastChecked)}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Automatic checks run according to configured frequency</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
              <span className="text-sm font-medium text-emerald-700">All Systems Operational</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">All compliance checks are passing</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-100">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-emerald-800">Compliance Checking Procedures</CardTitle>
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <CardDescription>Monitoring and auditing requirements for the framework</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                Check Frequency
              </h3>
              <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="flex flex-wrap gap-3">
                  {checks.frequency.split("|").map((freq) => (
                    <div
                      key={freq}
                      className="flex items-center bg-white rounded-full px-3 py-1.5 border border-gray-200 shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                      <span className="text-sm">{freq}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500 flex items-start">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mr-1.5 flex-shrink-0 mt-0.5" />
                  <span>Critical changes always trigger immediate compliance checks regardless of schedule</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Database className="h-4 w-4 mr-2 text-emerald-600" />
                  Logging Requirements
                </h3>
                <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm h-full">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Encrypted Storage</p>
                        <p className="text-xs text-gray-500">All logs are encrypted at rest</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Timestamped Entries</p>
                        <p className="text-xs text-gray-500">All events include precise timestamps</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Retention Policy</p>
                        <p className="text-xs text-gray-500">Logs retained according to Australian requirements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-emerald-600" />
                  Auditing Controls
                </h3>
                <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm h-full">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Immutable Logs</p>
                        <p className="text-xs text-gray-500">Logs cannot be modified after creation</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Role-Based Access</p>
                        <p className="text-xs text-gray-500">Access to logs is controlled by user role</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Audit Trail</p>
                        <p className="text-xs text-gray-500">Complete history of all system actions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-emerald-600" />
                Escalation Path
              </h3>
              <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  {checks.escalation_path.map((role, index) => (
                    <div key={index} className="flex flex-col items-center mb-4 sm:mb-0">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                        <span className="text-emerald-700 font-bold">{index + 1}</span>
                      </div>
                      <div className="text-sm font-medium text-center">{role}</div>
                      {index < checks.escalation_path.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-gray-400 hidden sm:block mx-4" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      In case of compliance violations, follow this escalation path in order. Each level has 24 hours to
                      resolve before escalating to the next level, except for critical violations which escalate
                      immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
