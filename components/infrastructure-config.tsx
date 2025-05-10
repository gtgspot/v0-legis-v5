"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Server, Shield, Info, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InfrastructureProps {
  config: {
    scaling: {
      model: string
      requirement: string
      limit: string
      dynamic_permissions: boolean
    }
  }
}

export function InfrastructureConfig({ config }: InfrastructureProps) {
  const { scaling } = config
  const [activeTab, setActiveTab] = useState("scaling")

  return (
    <Card className="border-emerald-100">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-emerald-800">Infrastructure Configuration</CardTitle>
          <Cloud className="h-6 w-6 text-emerald-600" />
        </div>
        <CardDescription>Scaling and deployment requirements for compliant infrastructure</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="scaling"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            >
              <Server className="h-4 w-4 mr-2" />
              Scaling Model
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            >
              <Shield className="h-4 w-4 mr-2" />
              Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scaling" className="space-y-6">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <h3 className="text-sm font-medium text-emerald-800 mb-3">Available Deployment Models</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {scaling.model.split("|").map((model) => (
                  <div
                    key={model}
                    className="flex items-center bg-white rounded-full px-4 py-2 border border-emerald-200 shadow-sm"
                  >
                    <Check className="h-4 w-4 text-emerald-500 mr-2" />
                    <span className="text-sm font-medium">{model}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-emerald-700 flex items-start mt-2">
                <Info className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Both deployment models support dynamic scaling based on compliance status</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Compliance Requirement</h4>
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <code className="text-sm">{scaling.requirement}</code>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  This condition must be satisfied for infrastructure to scale
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Resource Limits</h4>
                <div className="bg-gray-50 p-3 rounded border border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium">{scaling.limit}</span>
                  {scaling.limit === "none" && (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Unlimited</Badge>
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  No hard limits on resources as long as compliance is maintained
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="rounded-lg bg-white p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-900">Dynamic Permissions</h3>
                <Badge
                  className={
                    scaling.dynamic_permissions ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }
                >
                  {scaling.dynamic_permissions ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600">Permissions adjust automatically based on compliance status</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600">Role-based access control with fine-grained permissions</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600">Audit trail for all permission changes</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Dynamic permissions allow the system to adjust access controls based on compliance status, user
                    context, and data sensitivity. This ensures that access is always appropriate to the current
                    compliance state.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
