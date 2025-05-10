"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Globe, Server, Zap, Shield, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export function SatelliteAPI() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedRegion, setSelectedRegion] = useState("ap-southeast-2")

  return (
    <Card className="border-amber-100">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-amber-800">Satellite API Replication</CardTitle>
          <Globe className="h-6 w-6 text-amber-600" />
        </div>
        <CardDescription>Global edge deployment for speed and continuity</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-t-none bg-gray-100 p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-amber-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="regions"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-amber-700"
            >
              Global Regions
            </TabsTrigger>
            <TabsTrigger
              value="compliance"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-amber-700"
            >
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6">
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-2">How It Works</h3>
                <p className="text-amber-700 mb-3">
                  Our Satellite API system replicates the framework's API across global edge locations, ensuring
                  low-latency access while maintaining compliance with Australian regulations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-amber-100 flex flex-col items-center text-center">
                    <div className="bg-amber-100 p-2 rounded-full mb-2">
                      <Globe className="h-5 w-5 text-amber-700" />
                    </div>
                    <h4 className="font-medium text-amber-800 mb-1">Global Reach</h4>
                    <p className="text-amber-600">API endpoints in 12+ regions worldwide</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-amber-100 flex flex-col items-center text-center">
                    <div className="bg-amber-100 p-2 rounded-full mb-2">
                      <Zap className="h-5 w-5 text-amber-700" />
                    </div>
                    <h4 className="font-medium text-amber-800 mb-1">Low Latency</h4>
                    <p className="text-amber-600">Sub-100ms response times globally</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-amber-100 flex flex-col items-center text-center">
                    <div className="bg-amber-100 p-2 rounded-full mb-2">
                      <Shield className="h-5 w-5 text-amber-700" />
                    </div>
                    <h4 className="font-medium text-amber-800 mb-1">Compliant</h4>
                    <p className="text-amber-600">Australian law compliance everywhere</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Server className="h-4 w-4 mr-2 text-amber-600" />
                    Architecture
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      The Satellite API system uses a hub-and-spoke architecture with Sydney as the primary hub. All
                      compliance rules and data governance policies are synchronized from the hub to satellite nodes.
                    </p>
                    <p>
                      Each satellite node maintains a local cache of rules and can operate independently if disconnected
                      from the hub, ensuring continuous operation even during network disruptions.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-amber-600" />
                    Performance Benefits
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-amber-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Reduced Latency:</span> 90% reduction in API response times for
                        global users
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-amber-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">High Availability:</span> 99.99% uptime with multi-region
                        redundancy
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-amber-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Scalability:</span> Automatic scaling based on regional demand
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Global Performance</h3>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Healthy</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Average Response Time</span>
                      <span className="text-amber-700 font-medium">87ms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Global Availability</span>
                      <span className="text-amber-700 font-medium">99.99%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "99.99%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Rule Sync Status</span>
                      <span className="text-amber-700 font-medium">100% Synchronized</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="regions" className="p-6">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-4">Global Deployment Map</h3>

                <div className="relative w-full h-[300px] bg-blue-50 rounded-lg overflow-hidden border border-blue-100 mb-4">
                  {/* World Map Visualization */}
                  <svg viewBox="0 0 1000 500" className="w-full h-full">
                    {/* Simplified world map background */}
                    <path
                      d="M150,250 Q500,150 850,250 Q500,350 150,250"
                      fill="#e0f2fe"
                      stroke="#bfdbfe"
                      strokeWidth="1"
                    />

                    {/* Hub - Sydney */}
                    <circle
                      cx="850"
                      cy="380"
                      r="15"
                      fill={selectedRegion === "ap-southeast-2" ? "#f59e0b" : "#fcd34d"}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-amber-500 transition-colors"
                      onClick={() => setSelectedRegion("ap-southeast-2")}
                    />
                    <text x="850" y="410" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">
                      Sydney
                    </text>

                    {/* US West */}
                    <circle
                      cx="150"
                      cy="200"
                      r="10"
                      fill={selectedRegion === "us-west-1" ? "#f59e0b" : "#fcd34d"}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-amber-500 transition-colors"
                      onClick={() => setSelectedRegion("us-west-1")}
                    />
                    <text x="150" y="230" textAnchor="middle" fill="#92400e" fontSize="12">
                      US West
                    </text>

                    {/* US East */}
                    <circle
                      cx="250"
                      cy="200"
                      r="10"
                      fill={selectedRegion === "us-east-1" ? "#f59e0b" : "#fcd34d"}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-amber-500 transition-colors"
                      onClick={() => setSelectedRegion("us-east-1")}
                    />
                    <text x="250" y="230" textAnchor="middle" fill="#92400e" fontSize="12">
                      US East
                    </text>

                    {/* EU West */}
                    <circle
                      cx="450"
                      cy="180"
                      r="10"
                      fill={selectedRegion === "eu-west-1" ? "#f59e0b" : "#fcd34d"}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-amber-500 transition-colors"
                      onClick={() => setSelectedRegion("eu-west-1")}
                    />
                    <text x="450" y="210" textAnchor="middle" fill="#92400e" fontSize="12">
                      EU West
                    </text>

                    {/* EU Central */}
                    <circle
                      cx="500"
                      cy="180"
                      r="10"
                      fill={selectedRegion === "eu-central-1" ? "#f59e0b" : "#fcd34d"}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-amber-500 transition-colors"
                      onClick={() => setSelectedRegion("eu-central-1")}
                    />
                    <text x="500" y="210" textAnchor="middle" fill="#92400e" fontSize="12">
                      EU Central
                    </text>

                    {/* Asia Pacific */}
                    <circle
                      cx="700"
                      cy="250"
                      r="10"
                      fill={selectedRegion === "ap-northeast-1" ? "#f59e0b" : "#fcd34d"}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-amber-500 transition-colors"
                      onClick={() => setSelectedRegion("ap-northeast-1")}
                    />
                    <text x="700" y="280" textAnchor="middle" fill="#92400e" fontSize="12">
                      Tokyo
                    </text>

                    {/* Singapore */}
                    <circle
                      cx="700"
                      cy="300"
                      r="10"
                      fill={selectedRegion === "ap-southeast-1" ? "#f59e0b" : "#fcd34d"}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-amber-500 transition-colors"
                      onClick={() => setSelectedRegion("ap-southeast-1")}
                    />
                    <text x="700" y="330" textAnchor="middle" fill="#92400e" fontSize="12">
                      Singapore
                    </text>

                    {/* Connection lines from Sydney hub */}
                    <line x1="850" y1="380" x2="150" y2="200" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="850" y1="380" x2="250" y2="200" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="850" y1="380" x2="450" y2="180" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="850" y1="380" x2="500" y2="180" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="850" y1="380" x2="700" y2="250" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="850" y1="380" x2="700" y2="300" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                  </svg>

                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded text-xs text-gray-600">
                    Click on a region to view details
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      {selectedRegion === "ap-southeast-2" && "Sydney (Hub)"}
                      {selectedRegion === "us-west-1" && "US West (San Francisco)"}
                      {selectedRegion === "us-east-1" && "US East (Virginia)"}
                      {selectedRegion === "eu-west-1" && "EU West (Ireland)"}
                      {selectedRegion === "eu-central-1" && "EU Central (Frankfurt)"}
                      {selectedRegion === "ap-northeast-1" && "Asia Pacific (Tokyo)"}
                      {selectedRegion === "ap-southeast-1" && "Asia Pacific (Singapore)"}
                    </h4>
                    <Badge
                      className={
                        selectedRegion === "ap-southeast-2"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {selectedRegion === "ap-southeast-2" ? "Primary Hub" : "Satellite"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium text-green-700">Online</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Response Time</span>
                        <span className="font-medium">
                          {selectedRegion === "ap-southeast-2" && "12ms"}
                          {selectedRegion === "us-west-1" && "142ms"}
                          {selectedRegion === "us-east-1" && "156ms"}
                          {selectedRegion === "eu-west-1" && "178ms"}
                          {selectedRegion === "eu-central-1" && "185ms"}
                          {selectedRegion === "ap-northeast-1" && "98ms"}
                          {selectedRegion === "ap-southeast-1" && "76ms"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Sync</span>
                        <span className="font-medium">
                          {selectedRegion === "ap-southeast-2" ? "N/A (Primary)" : "2 minutes ago"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Traffic</span>
                        <span className="font-medium">
                          {selectedRegion === "ap-southeast-2" && "42%"}
                          {selectedRegion === "us-west-1" && "12%"}
                          {selectedRegion === "us-east-1" && "15%"}
                          {selectedRegion === "eu-west-1" && "14%"}
                          {selectedRegion === "eu-central-1" && "8%"}
                          {selectedRegion === "ap-northeast-1" && "5%"}
                          {selectedRegion === "ap-southeast-1" && "4%"}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Rules Version</span>
                        <span className="font-medium">v1.0.42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Compliance</span>
                        <span className="font-medium text-green-700">✓ Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="p-6">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-emerald-600" />
                  Global Compliance Approach
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    Our Satellite API system ensures that all global deployments maintain compliance with Australian
                    regulations while also respecting local laws in each deployment region.
                  </p>
                  <p>
                    The system uses a "compliance-first" architecture where all API requests are validated against both
                    Australian requirements and local jurisdictional rules before processing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-emerald-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Rule Synchronization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-gray-700">
                        All compliance rules are synchronized from the Sydney hub to satellite nodes using a secure,
                        versioned distribution system.
                      </p>
                      <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        <h4 className="font-medium text-emerald-800 mb-1">Features</h4>
                        <ul className="list-disc pl-5 text-emerald-700 space-y-1">
                          <li>Cryptographically signed rule updates</li>
                          <li>Version control with rollback capability</li>
                          <li>Automatic conflict resolution</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Jurisdictional Adaptations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-gray-700">
                        The system can adapt to local jurisdictional requirements while maintaining core Australian
                        compliance.
                      </p>
                      <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        <h4 className="font-medium text-emerald-800 mb-1">Examples</h4>
                        <ul className="list-disc pl-5 text-emerald-700 space-y-1">
                          <li>GDPR adaptations for EU satellites</li>
                          <li>CCPA compliance for US California nodes</li>
                          <li>PDPA alignment for Singapore deployment</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Latency vs. Compliance Balance</h3>
                    <p className="text-sm text-gray-700">
                      The Satellite API system is designed to balance low-latency performance with strict compliance
                      requirements. In cases where compliance validation would introduce unacceptable latency, the
                      system uses a "pre-validated operations" approach where common operations are pre-validated and
                      cached at each satellite node.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Compliance Conflict Resolution</h3>
                    <p className="text-sm text-gray-700">
                      In cases where Australian compliance requirements conflict with local regulations, the system
                      follows a "strictest rule applies" policy. This ensures that operations always comply with both
                      Australian law and local requirements, defaulting to the more restrictive interpretation when
                      conflicts arise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
