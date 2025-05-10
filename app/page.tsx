"use client"

import { useState } from "react"
import { useFrameworkData } from "@/lib/hooks"
import { ComplianceFramework } from "@/components/compliance-framework"
import { CaseLaw } from "@/components/case-law"
import { Button } from "@/components/ui/button"
import { Download, BookOpen, Shield, Loader2, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArchitectureDiagram } from "@/components/architecture-diagram"
import { FederatedLearning } from "@/components/federated-learning"
import { ZeroKnowledgeProofs } from "@/components/zero-knowledge-proofs"
import { SatelliteAPI } from "@/components/satellite-api"
import { LegalInformation } from "@/components/legal-information"
import { DataLexButton } from "@/components/datalex-button"
import { LegalInformationDataLex } from "@/components/legal-information-datalex"

export default function HomePage() {
  const [showCaseLaw, setShowCaseLaw] = useState(false)
  const { framework, isLoading, isError } = useFrameworkData()
  const [activeTab, setActiveTab] = useState("framework")

  const toggleCaseLaw = () => {
    setShowCaseLaw(!showCaseLaw)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="mr-3 bg-emerald-600 text-white p-1 rounded">
                  <Shield className="h-5 w-5" />
                </div>
                AU-Legis-Compliant Framework
              </h1>
              <p className="text-gray-600 mt-1 text-sm max-w-2xl">
                A modular AI governance framework with advanced privacy and global capabilities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="case-law-toggle"
                  checked={showCaseLaw}
                  onCheckedChange={toggleCaseLaw}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <Label htmlFor="case-law-toggle" className="flex items-center cursor-pointer">
                  <BookOpen className="h-4 w-4 mr-1 text-emerald-700" />
                  Case Law
                </Label>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <DataLexButton />
                <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Configure</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
            <span className="ml-2 text-lg text-gray-600">Loading framework data...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <h2 className="text-lg font-medium">Error loading framework data</h2>
            <p>There was a problem fetching the latest framework data. Please try again later.</p>
            <Button
              variant="outline"
              className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {showCaseLaw ? "Australian Case Law" : "Framework Overview"}
                  </h2>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      v{framework?.version}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {framework?.jurisdiction}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                      Effective: {framework?.effective_date}
                    </span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 text-sm text-gray-500 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  Live Data - Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="p-6">{showCaseLaw ? <CaseLaw /> : <ComplianceFramework framework={framework} />}</div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                  <p className="text-gray-500">Format: YAML RAC (Rules as Code) | License: Apache-2.0</p>
                  <p className="mt-2 sm:mt-0 text-emerald-600 hover:text-emerald-700 cursor-pointer">
                    View Documentation
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">Enhanced Capabilities</h2>
                <p className="text-gray-600 mt-1 text-sm">
                  Advanced features for privacy-preserving, globally distributed AI governance
                </p>
              </div>

              <div className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 rounded-lg bg-gray-100 p-1">
                    <TabsTrigger
                      value="framework"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
                    >
                      Architecture
                    </TabsTrigger>
                    <TabsTrigger
                      value="federated"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
                    >
                      Federated Learning
                    </TabsTrigger>
                    <TabsTrigger
                      value="zkp"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                    >
                      Zero-Knowledge
                    </TabsTrigger>
                    <TabsTrigger
                      value="satellite"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
                    >
                      Satellite API
                    </TabsTrigger>
                    <TabsTrigger
                      value="legal"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm"
                    >
                      Legal Information
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="framework" className="mt-6">
                    <ArchitectureDiagram />
                  </TabsContent>

                  <TabsContent value="federated" className="mt-6">
                    <FederatedLearning />
                  </TabsContent>

                  <TabsContent value="zkp" className="mt-6">
                    <ZeroKnowledgeProofs />
                  </TabsContent>

                  <TabsContent value="satellite" className="mt-6">
                    <SatelliteAPI />
                  </TabsContent>

                  <TabsContent value="legal" className="mt-6">
                    <LegalInformation />
                    <LegalInformationDataLex />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
