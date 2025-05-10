"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RuleDisplay } from "./rule-display"
import { InfrastructureConfig } from "./infrastructure-config"
import { ComplianceChecks } from "./compliance-checks"
import { ComplianceSummary } from "./compliance-summary"
import { SearchBar } from "./search-bar"

interface ComplianceFrameworkProps {
  framework: any
}

export function ComplianceFramework({ framework }: ComplianceFrameworkProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const filteredRules = framework?.rules.filter(
    (rule: any) =>
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.source.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <ComplianceSummary rules={framework?.rules || []} />

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-lg bg-gray-100 p-1">
          <TabsTrigger
            value="rules"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
          >
            Compliance Rules
          </TabsTrigger>
          <TabsTrigger
            value="infrastructure"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
          >
            Infrastructure
          </TabsTrigger>
          <TabsTrigger
            value="checks"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
          >
            Compliance Checks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="mt-6">
          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search rules by title, ID, or source..."
              initialValue={searchTerm}
            />
          </div>

          <div className="space-y-6">
            {filteredRules && filteredRules.length > 0 ? (
              filteredRules.map((rule: any) => <RuleDisplay key={rule.id} rule={rule} />)
            ) : (
              <div className="text-center py-8 text-gray-500">No rules match your search criteria</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="mt-6">
          <InfrastructureConfig config={framework?.infrastructure} />
        </TabsContent>

        <TabsContent value="checks" className="mt-6">
          <ComplianceChecks checks={framework?.compliance_checks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
