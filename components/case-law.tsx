"use client"

import { useState } from "react"
import { useCaseLaw } from "@/lib/hooks"
import { SearchBar } from "./search-bar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, BookOpen, FileText, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CaseLaw() {
  const [searchTerm, setSearchTerm] = useState("")
  const { caseLaw, isLoading, isError } = useCaseLaw(searchTerm)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  // Group cases by relevant rules
  const casesByRule = caseLaw.reduce((acc: Record<string, any[]>, caseItem) => {
    caseItem.relevantRules.forEach((rule) => {
      if (!acc[rule]) {
        acc[rule] = []
      }
      acc[rule].push(caseItem)
    })
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 text-emerald-600 mr-2" />
          <h2 className="text-xl font-semibold">Australian Case Law</h2>
        </div>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search cases by keyword, rule ID, or content..."
          className="md:w-96"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading case law...</span>
        </div>
      ) : isError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Error loading case law</h3>
                <p className="text-sm text-red-700 mt-1">
                  There was a problem fetching the case law data. Please try again later.
                </p>
                <Button
                  variant="outline"
                  className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : caseLaw.length === 0 ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">No matching cases found</h3>
                <p className="text-sm text-amber-700 mt-1">
                  No case law matches your search criteria. Try different keywords or browse all cases.
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Display cases grouped by rule */}
          {Object.keys(casesByRule).length > 0 && !searchTerm && (
            <div className="space-y-6">
              {Object.entries(casesByRule).map(([ruleId, cases]) => (
                <Card key={ruleId} className="border-emerald-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Badge className="mr-2 bg-emerald-100 text-emerald-800 border-0">{ruleId}</Badge>
                        Related Case Law
                      </CardTitle>
                      <Badge variant="outline">{cases.length} cases</Badge>
                    </div>
                    <CardDescription>Cases relevant to rule {ruleId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {cases.map((caseItem) => (
                        <CaseLawItem key={caseItem.id} caseItem={caseItem} />
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Display all cases when searching */}
          {searchTerm && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Search Results</CardTitle>
                  <Badge variant="outline">{caseLaw.length} cases found</Badge>
                </div>
                <CardDescription>Cases matching "{searchTerm}"</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {caseLaw.map((caseItem) => (
                    <CaseLawItem key={caseItem.id} caseItem={caseItem} />
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

interface CaseLawItemProps {
  caseItem: {
    id: string
    title: string
    citation: string
    year: number
    court: string
    summary: string
    relevantRules: string[]
    keywords: string[]
  }
}

function CaseLawItem({ caseItem }: CaseLawItemProps) {
  return (
    <AccordionItem value={caseItem.id} className="border-b border-gray-200 py-2">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col items-start text-left">
          <div className="font-medium">{caseItem.title}</div>
          <div className="text-sm text-gray-500 mt-1">
            {caseItem.citation} ({caseItem.year}) - {caseItem.court}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2 pb-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{caseItem.summary}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center mr-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Relevant Rules:</span>
              {caseItem.relevantRules.map((rule) => (
                <Badge key={rule} className="mr-1 bg-blue-100 text-blue-800 border-0">
                  {rule}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700 mr-2">Keywords:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {caseItem.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="bg-gray-100 text-gray-800">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50">
              <FileText className="h-4 w-4 mr-1" />
              View Full Case
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
