"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Card className="border-emerald-100">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
        <CardTitle className="text-xl text-emerald-800">Enhanced Architecture</CardTitle>
        <CardDescription>
          Privacy-preserving, globally distributed, and legally compliant AI infrastructure
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-t-none bg-gray-100 p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-emerald-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="federated"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-emerald-700"
            >
              Federated Learning
            </TabsTrigger>
            <TabsTrigger
              value="satellite"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-emerald-700"
            >
              Satellite APIs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6">
            <div className="flex justify-center">
              <svg width="700" height="400" viewBox="0 0 700 400" className="max-w-full h-auto">
                {/* Background */}
                <rect x="0" y="0" width="700" height="400" fill="#f8fafc" rx="8" ry="8" />

                {/* Core System */}
                <rect
                  x="250"
                  y="150"
                  width="200"
                  height="100"
                  rx="8"
                  ry="8"
                  fill="#10b981"
                  fillOpacity="0.2"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <text x="350" y="185" textAnchor="middle" fill="#047857" fontWeight="bold" fontSize="14">
                  AU-Legis-Compliant
                </text>
                <text x="350" y="205" textAnchor="middle" fill="#047857" fontWeight="bold" fontSize="14">
                  Core Framework
                </text>

                {/* Federated Learning */}
                <rect
                  x="100"
                  y="50"
                  width="160"
                  height="80"
                  rx="8"
                  ry="8"
                  fill="#3b82f6"
                  fillOpacity="0.2"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <text x="180" y="90" textAnchor="middle" fill="#1d4ed8" fontWeight="bold" fontSize="14">
                  Federated Learning
                </text>
                <text x="180" y="110" textAnchor="middle" fill="#1d4ed8" fontSize="12">
                  Privacy-Aligned Nodes
                </text>

                {/* Zero-Knowledge Proofs */}
                <rect
                  x="440"
                  y="50"
                  width="160"
                  height="80"
                  rx="8"
                  ry="8"
                  fill="#8b5cf6"
                  fillOpacity="0.2"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />
                <text x="520" y="90" textAnchor="middle" fill="#5b21b6" fontWeight="bold" fontSize="14">
                  Zero-Knowledge
                </text>
                <text x="520" y="110" textAnchor="middle" fill="#5b21b6" fontSize="12">
                  Compliance Proofs
                </text>

                {/* Satellite API */}
                <rect
                  x="100"
                  y="270"
                  width="160"
                  height="80"
                  rx="8"
                  ry="8"
                  fill="#f59e0b"
                  fillOpacity="0.2"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <text x="180" y="310" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="14">
                  Satellite API
                </text>
                <text x="180" y="330" textAnchor="middle" fill="#b45309" fontSize="12">
                  Global Edge Replication
                </text>

                {/* Legal Information Access */}
                <rect
                  x="440"
                  y="270"
                  width="160"
                  height="80"
                  rx="8"
                  ry="8"
                  fill="#ec4899"
                  fillOpacity="0.2"
                  stroke="#ec4899"
                  strokeWidth="2"
                />
                <text x="520" y="310" textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="14">
                  Legal Information
                </text>
                <text x="520" y="330" textAnchor="middle" fill="#be185d" fontSize="12">
                  Real-time Access
                </text>

                {/* Connection Lines */}
                <line x1="180" y1="130" x2="250" y2="170" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="520" y1="130" x2="450" y2="170" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="180" y1="270" x2="250" y2="230" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="520" y1="270" x2="450" y2="230" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <h3 className="font-medium text-emerald-800 mb-1">Core Framework</h3>
                <p className="text-emerald-700">Central compliance engine with rule processing and enforcement</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-1">Federated Learning</h3>
                <p className="text-blue-700">Distributed model training without exposing sensitive data</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-1">Zero-Knowledge Proofs</h3>
                <p className="text-purple-700">Verify compliance without revealing underlying data</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-1">Satellite API</h3>
                <p className="text-amber-700">Global edge deployment for low-latency access worldwide</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="federated" className="p-6">
            <div className="flex justify-center">
              <svg width="700" height="400" viewBox="0 0 700 400" className="max-w-full h-auto">
                {/* Background */}
                <rect x="0" y="0" width="700" height="400" fill="#f8fafc" rx="8" ry="8" />

                {/* Central Aggregator */}
                <rect
                  x="300"
                  y="170"
                  width="100"
                  height="60"
                  rx="8"
                  ry="8"
                  fill="#3b82f6"
                  fillOpacity="0.2"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <text x="350" y="205" textAnchor="middle" fill="#1d4ed8" fontWeight="bold" fontSize="12">
                  Aggregator
                </text>

                {/* Nodes */}
                <g>
                  <rect
                    x="100"
                    y="80"
                    width="120"
                    height="60"
                    rx="8"
                    ry="8"
                    fill="#3b82f6"
                    fillOpacity="0.2"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <text x="160" y="115" textAnchor="middle" fill="#1d4ed8" fontWeight="bold" fontSize="12">
                    NSW Node
                  </text>
                </g>
                <g>
                  <rect
                    x="100"
                    y="260"
                    width="120"
                    height="60"
                    rx="8"
                    ry="8"
                    fill="#3b82f6"
                    fillOpacity="0.2"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <text x="160" y="295" textAnchor="middle" fill="#1d4ed8" fontWeight="bold" fontSize="12">
                    VIC Node
                  </text>
                </g>
                <g>
                  <rect
                    x="480"
                    y="80"
                    width="120"
                    height="60"
                    rx="8"
                    ry="8"
                    fill="#3b82f6"
                    fillOpacity="0.2"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <text x="540" y="115" textAnchor="middle" fill="#1d4ed8" fontWeight="bold" fontSize="12">
                    QLD Node
                  </text>
                </g>
                <g>
                  <rect
                    x="480"
                    y="260"
                    width="120"
                    height="60"
                    rx="8"
                    ry="8"
                    fill="#3b82f6"
                    fillOpacity="0.2"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <text x="540" y="295" textAnchor="middle" fill="#1d4ed8" fontWeight="bold" fontSize="12">
                    WA Node
                  </text>
                </g>

                {/* Connection Lines */}
                <line x1="220" y1="110" x2="300" y2="180" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="220" y1="290" x2="300" y2="220" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="480" y1="110" x2="400" y2="180" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="480" y1="290" x2="400" y2="220" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />

                {/* Data Flow Arrows */}
                <circle cx="260" cy="145" r="5" fill="#3b82f6" />
                <text x="280" y="145" fontSize="10" fill="#1d4ed8">
                  Model Updates
                </text>

                <circle cx="260" cy="255" r="5" fill="#3b82f6" />
                <text x="280" y="255" fontSize="10" fill="#1d4ed8">
                  Model Updates
                </text>

                <circle cx="440" cy="145" r="5" fill="#3b82f6" />
                <text x="420" y="145" textAnchor="end" fontSize="10" fill="#1d4ed8">
                  Model Updates
                </text>

                <circle cx="440" cy="255" r="5" fill="#3b82f6" />
                <text x="420" y="255" textAnchor="end" fontSize="10" fill="#1d4ed8">
                  Model Updates
                </text>

                {/* Privacy Shield */}
                <rect
                  x="290"
                  y="30"
                  width="120"
                  height="40"
                  rx="20"
                  ry="20"
                  fill="#10b981"
                  fillOpacity="0.2"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <text x="350" y="55" textAnchor="middle" fill="#047857" fontWeight="bold" fontSize="12">
                  Privacy Shield
                </text>
              </svg>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-1">Federated Learning Process</h3>
                <p className="text-blue-700">
                  Model training occurs locally on each node, with only model updates (not raw data) shared with the
                  central aggregator. Each node maintains compliance with local privacy regulations.
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <h3 className="font-medium text-emerald-800 mb-1">Privacy Guarantees</h3>
                <ul className="list-disc pl-5 text-emerald-700 space-y-1">
                  <li>Differential privacy applied to model updates</li>
                  <li>Secure aggregation protocols prevent individual data leakage</li>
                  <li>Jurisdictional boundaries respected for data sovereignty</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="satellite" className="p-6">
            <div className="flex justify-center">
              <svg width="700" height="400" viewBox="0 0 700 400" className="max-w-full h-auto">
                {/* Background with world map silhouette */}
                <rect x="0" y="0" width="700" height="400" fill="#f8fafc" rx="8" ry="8" />
                <path d="M100,200 Q350,100 600,200 Q350,300 100,200" fill="#f0f9ff" stroke="#bfdbfe" strokeWidth="1" />

                {/* Central Hub */}
                <circle cx="350" cy="200" r="40" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                <text x="350" y="205" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="12">
                  Sydney Hub
                </text>

                {/* Satellite Nodes */}
                <circle cx="150" cy="150" r="25" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                <text x="150" y="155" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="10">
                  US West
                </text>

                <circle cx="200" cy="250" r="25" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                <text x="200" y="255" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="10">
                  Brazil
                </text>

                <circle cx="500" cy="150" r="25" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                <text x="500" y="155" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="10">
                  EU
                </text>

                <circle cx="550" cy="250" r="25" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                <text x="550" y="255" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="10">
                  Singapore
                </text>

                {/* Connection Lines */}
                <line x1="175" y1="150" x2="310" y2="185" stroke="#f59e0b" strokeWidth="2" />
                <line x1="225" y1="250" x2="310" y2="215" stroke="#f59e0b" strokeWidth="2" />
                <line x1="475" y1="150" x2="390" y2="185" stroke="#f59e0b" strokeWidth="2" />
                <line x1="525" y1="250" x2="390" y2="215" stroke="#f59e0b" strokeWidth="2" />

                {/* Data Flow Indicators */}
                <circle cx="242" cy="167" r="5" fill="#f59e0b" />
                <circle cx="267" cy="232" r="5" fill="#f59e0b" />
                <circle cx="432" cy="167" r="5" fill="#f59e0b" />
                <circle cx="457" cy="232" r="5" fill="#f59e0b" />

                {/* Compliance Shield */}
                <rect
                  x="290"
                  y="30"
                  width="120"
                  height="40"
                  rx="20"
                  ry="20"
                  fill="#10b981"
                  fillOpacity="0.2"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <text x="350" y="55" textAnchor="middle" fill="#047857" fontWeight="bold" fontSize="12">
                  Compliance Layer
                </text>
              </svg>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-1">Global API Replication</h3>
                <p className="text-amber-700">
                  The framework's API is replicated across global edge locations, ensuring low-latency access while
                  maintaining compliance with Australian regulations at the core.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <h3 className="font-medium text-emerald-800 mb-1">Compliance Enforcement</h3>
                  <ul className="list-disc pl-5 text-emerald-700 space-y-1">
                    <li>Rules synchronized globally</li>
                    <li>Local adaptations for regional laws</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-1">Resilience Benefits</h3>
                  <ul className="list-disc pl-5 text-blue-700 space-y-1">
                    <li>Continuous operation</li>
                    <li>Disaster recovery</li>
                    <li>Load balancing</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
