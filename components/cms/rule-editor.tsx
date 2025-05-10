"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Trash, AlertTriangle, Link } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LegalSourceSelector } from "./legal-source-selector"

interface RuleEditorProps {
  rule?: any
  onClose: () => void
}

export function RuleEditor({ rule, onClose }: RuleEditorProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    id: rule?.id || "",
    title: rule?.title || "",
    source: rule?.source || "",
    category: rule?.category || "privacy",
    status: rule?.status || "active",
    condition: rule?.condition || "",
    requirement: rule?.requirement || "",
    consequence: rule?.consequence || "",
    enforcement: rule?.enforcement || "",
    isPublic: rule?.isPublic || true,
    legalSources: rule?.legalSources || [],
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving rule:", formData)
    // Here you would typically save the rule to your backend
    onClose()
  }

  const handleAddLegalSource = (source: any) => {
    setFormData((prev) => ({
      ...prev,
      legalSources: [...prev.legalSources, source],
    }))
  }

  const handleRemoveLegalSource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      legalSources: prev.legalSources.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onClose} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{rule ? "Edit Rule" : "Create New Rule"}</h1>
          <p className="text-gray-500">
            {rule ? `Editing rule ${rule.id}` : "Define a new compliance rule for the framework"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Rule Details</CardTitle>
            <CardDescription>Define the core properties of this compliance rule</CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3 rounded-lg bg-gray-100 p-1">
                <TabsTrigger
                  value="basic"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
                >
                  Basic Information
                </TabsTrigger>
                <TabsTrigger
                  value="conditions"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
                >
                  Conditions & Requirements
                </TabsTrigger>
                <TabsTrigger
                  value="legal"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
                >
                  Legal Sources
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Rule ID</Label>
                    <Input
                      id="id"
                      placeholder="e.g., PRIV-03"
                      value={formData.id}
                      onChange={(e) => handleChange("id", e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      A unique identifier for this rule. Use the format CATEGORY-XX.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Data Must Be Handled Lawfully"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">A clear, concise title describing the rule's purpose.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      placeholder="e.g., Privacy Act 1988 (Cth)"
                      value={formData.source}
                      onChange={(e) => handleChange("source", e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">The primary legal source this rule is derived from.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="privacy">Privacy</SelectItem>
                        <SelectItem value="consumer">Consumer</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">The category this rule belongs to.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">The current status of this rule.</p>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isPublic" className="cursor-pointer">
                        Public Rule
                      </Label>
                      <Switch
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleChange("isPublic", checked)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      If enabled, this rule will be visible in the public framework documentation.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conditions" className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Textarea
                    id="condition"
                    placeholder="e.g., data.contains_personal_information == true"
                    value={formData.condition}
                    onChange={(e) => handleChange("condition", e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500">
                    The condition that triggers this rule. Use pseudo-code or natural language.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirement">Requirement</Label>
                  <Textarea
                    id="requirement"
                    placeholder="e.g., data.has_consent == true"
                    value={formData.requirement}
                    onChange={(e) => handleChange("requirement", e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500">
                    What must be true for the system to be compliant with this rule.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consequence">Consequence</Label>
                  <Textarea
                    id="consequence"
                    placeholder="e.g., Block processing and alert user if no valid consent"
                    value={formData.consequence}
                    onChange={(e) => handleChange("consequence", e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500">
                    What happens if the requirement is not met. Describe the system's response.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enforcement">Enforcement (Optional)</Label>
                  <Textarea
                    id="enforcement"
                    placeholder="e.g., OAIC audit-compliant logging must be enabled"
                    value={formData.enforcement}
                    onChange={(e) => handleChange("enforcement", e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500">
                    Additional enforcement requirements or compliance mechanisms for this rule.
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-800 mb-1">Condition Format Guidelines</h3>
                      <p className="text-sm text-amber-700">
                        Write conditions and requirements in a consistent format to ensure they can be properly
                        interpreted by the compliance engine. Use dot notation for object properties and standard
                        comparison operators.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="legal" className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Legal Sources</Label>
                  <p className="text-sm text-gray-600">
                    Link this rule to specific legal sources for traceability and documentation.
                  </p>

                  <div className="mt-4 space-y-4">
                    {formData.legalSources.length > 0 ? (
                      <div className="space-y-3">
                        {formData.legalSources.map((source: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                          >
                            <div>
                              <div className="flex items-center">
                                <Badge
                                  className={
                                    source.type === "legislation"
                                      ? "bg-blue-100 text-blue-800"
                                      : source.type === "case"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {source.type}
                                </Badge>
                                <h4 className="ml-2 font-medium">{source.title}</h4>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {source.type === "legislation"
                                  ? `Sections: ${source.sections.join(", ")}`
                                  : `Citation: ${source.citation}`}
                              </div>
                              <div className="flex items-center text-xs text-blue-600 mt-2">
                                <Link className="h-3 w-3 mr-1" />
                                <a href={source.url} target="_blank" rel="noopener noreferrer">
                                  View source
                                </a>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveLegalSource(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500">No legal sources linked to this rule yet.</p>
                      </div>
                    )}

                    <LegalSourceSelector onAddSource={handleAddLegalSource} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {rule && (
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4 mr-2" />
                {rule ? "Update Rule" : "Create Rule"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
