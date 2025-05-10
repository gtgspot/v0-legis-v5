"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Server, Lock, Activity, Check, AlertTriangle } from "lucide-react"

export function FederatedLearning() {
  const [activeTab, setActiveTab] = useState("overview")
  const [trainingProgress, setTrainingProgress] = useState(68)
  const [nodesOnline, setNodesOnline] = useState(7)
  const [lastUpdate, setLastUpdate] = useState("2025-04-22T14:32:15")

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
    <Card className="border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-blue-800">Federated Learning System</CardTitle>
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardDescription>Privacy-preserving distributed learning across Australian jurisdictions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-t-none bg-gray-100 p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-blue-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="nodes"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-blue-700"
            >
              Privacy Nodes
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-blue-700"
            >
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">How It Works</h3>
                <p className="text-blue-700 mb-3">
                  Our federated learning system allows AI models to be trained across multiple Australian jurisdictions
                  without sharing sensitive data, ensuring compliance with the Privacy Act 1988 (Cth).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-blue-100 flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-2 rounded-full mb-2">
                      <Server className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="font-medium text-blue-800 mb-1">Local Training</h4>
                    <p className="text-blue-600">Models train on local data within each jurisdiction</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-2 rounded-full mb-2">
                      <Lock className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="font-medium text-blue-800 mb-1">Secure Aggregation</h4>
                    <p className="text-blue-600">Only model updates are shared, not raw data</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-2 rounded-full mb-2">
                      <Activity className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="font-medium text-blue-800 mb-1">Global Model</h4>
                    <p className="text-blue-600">Updates combined into improved global model</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                    Privacy Guarantees
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Differential Privacy:</span> Mathematical guarantee that
                        individual data cannot be reverse-engineered
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Secure Aggregation:</span> Cryptographic protocols ensure even the
                        server cannot see individual updates
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Data Sovereignty:</span> Data never leaves its jurisdiction of
                        origin
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-emerald-600" />
                    Legal Compliance
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Privacy Act 1988:</span> Complies with Australian Privacy
                        Principles
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">State Privacy Laws:</span> Respects state-specific privacy
                        legislation
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Transparency:</span> Auditable training process with compliance
                        logs
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Current Training Status</h3>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Active</Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Training Progress</span>
                      <span className="text-blue-700 font-medium">{trainingProgress}%</span>
                    </div>
                    <Progress value={trainingProgress} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Nodes Online</span>
                    <span className="text-blue-700 font-medium">{nodesOnline}/8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Last Update</span>
                    <span className="text-blue-700 font-medium">{formatDate(lastUpdate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nodes" className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">NSW Node</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <CardDescription>Sydney Data Center</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Volume</span>
                        <span className="font-medium">1.2TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Privacy Level</span>
                        <span className="font-medium text-blue-700">APP Compliant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Contribution</span>
                        <span className="font-medium">12 minutes ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">VIC Node</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <CardDescription>Melbourne Data Center</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Volume</span>
                        <span className="font-medium">0.9TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Privacy Level</span>
                        <span className="font-medium text-blue-700">VPPA Compliant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Contribution</span>
                        <span className="font-medium">8 minutes ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">QLD Node</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <CardDescription>Brisbane Data Center</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Volume</span>
                        <span className="font-medium">0.7TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Privacy Level</span>
                        <span className="font-medium text-blue-700">IPA Compliant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Contribution</span>
                        <span className="font-medium">15 minutes ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">WA Node</CardTitle>
                      <Badge className="bg-amber-100 text-amber-800">Syncing</Badge>
                    </div>
                    <CardDescription>Perth Data Center</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Volume</span>
                        <span className="font-medium">0.5TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Privacy Level</span>
                        <span className="font-medium text-blue-700">APP Compliant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Contribution</span>
                        <span className="font-medium">42 minutes ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Privacy Safeguards</h3>
                    <p className="text-sm text-gray-700">
                      Each node implements differential privacy with an epsilon value of 2.0, ensuring individual data
                      points cannot be reverse-engineered from model updates. All nodes maintain compliance with both
                      federal Privacy Act requirements and state-specific privacy legislation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3">Model Accuracy</h3>
                  <div className="text-3xl font-bold text-blue-700 mb-1">94.2%</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +2.1% from centralized
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3">Privacy Budget</h3>
                  <div className="text-3xl font-bold text-blue-700 mb-1">ε = 2.0</div>
                  <div className="text-sm text-gray-600">Differential privacy guarantee</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3">Training Rounds</h3>
                  <div className="text-3xl font-bold text-blue-700 mb-1">142</div>
                  <div className="text-sm text-gray-600">Completed federation cycles</div>
                </div>
              </div>

              <Card className="border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle>Performance Comparison</CardTitle>
                  <CardDescription>Federated vs. Centralized Learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Model Accuracy</span>
                        <span className="text-blue-700 font-medium">94.2% vs 92.1%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "94.2%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Data Privacy</span>
                        <span className="text-blue-700 font-medium">High vs Low</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Training Time</span>
                        <span className="text-amber-700 font-medium">1.4x Longer</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Compliance Score</span>
                        <span className="text-blue-700 font-medium">98% vs 72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "98%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
