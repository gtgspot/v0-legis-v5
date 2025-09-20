"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { searchLegalSources } from "@/app/actions/legal-sources"
import type { LegalSearchFilters, LegalSearchResult } from "@/app/actions/legal-sources"
import { SearchBar } from "./search-bar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  BookOpen,
  FileText,
  ExternalLink,
  Search,
  Database,
  Scale,
  AlertTriangle,
  Loader2,
  Filter,
  Clock,
  Download,
  Share2,
  Copy,
  BookmarkPlus,
  History,
  X,
  CheckCircle2,
  Calendar,
  Tag,
  Bookmark,
  Quote,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { austliiDOMStructure } from "@/lib/austlii-parser"
import { LegalDocumentViewer } from "./legal-document-viewer"
import { LegalCitationGenerator } from "./legal-citation-generator"

// Types for legal information
type LegalSource = Omit<LegalSearchResult, "type" | "relevance"> & {
  type: "case" | "legislation" | "regulation" | "guidance" | "rule"
  relevance: "High" | "Medium" | "Low"
}

type SearchFilters = LegalSearchFilters

const allowedResultTypes: LegalSource["type"][] = [
  "case",
  "legislation",
  "regulation",
  "guidance",
  "rule",
]

const allowedRelevance: LegalSource["relevance"][] = ["High", "Medium", "Low"]

function normalizeResult(result: LegalSearchResult): LegalSource {
  const normalizedType = allowedResultTypes.includes(result.type as LegalSource["type"])
    ? (result.type as LegalSource["type"])
    : "guidance"

  const normalizedRelevance = allowedRelevance.includes(result.relevance as LegalSource["relevance"])
    ? (result.relevance as LegalSource["relevance"])
    : "Medium"

  return {
    ...result,
    type: normalizedType,
    relevance: normalizedRelevance,
    jurisdiction: result.jurisdiction || "Unknown",
    source: result.source || "Unknown",
    summary: result.summary || "",
    tags: result.tags || [],
    dateAccessed: result.dateAccessed || new Date().toISOString().split("T")[0],
  }
}

function filterResultsBySearchFilters(results: LegalSource[], filters: SearchFilters) {
  return results.filter((result) => {
    if (filters.jurisdictions.length > 0 && !filters.jurisdictions.includes(result.jurisdiction)) {
      return false
    }

    if (filters.types.length > 0 && !filters.types.includes(result.type)) {
      return false
    }

    if (filters.years.length > 0 && (!result.year || !filters.years.includes(result.year))) {
      return false
    }

    if (filters.relevance.length > 0 && !filters.relevance.includes(result.relevance)) {
      return false
    }

    if (filters.sources.length > 0 && !filters.sources.includes(result.source)) {
      return false
    }

    return true
  })
}

export function LegalInformation() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [rawSearchResults, setRawSearchResults] = useState<LegalSource[]>([])
  const [searchResults, setSearchResults] = useState<LegalSource[]>([])
  const [savedSources, setSavedSources] = useState<LegalSource[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [selectedDocument, setSelectedDocument] = useState<LegalSource | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    jurisdictions: [],
    types: [],
    years: [],
    relevance: [],
    sources: [],
  })
  const [availableFilters, setAvailableFilters] = useState({
    jurisdictions: ["CTH", "VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"],
    types: ["case", "legislation", "regulation", "guidance", "rule"],
    years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
    relevance: ["High", "Medium", "Low"],
    sources: [
      "AustLII",
      "Jade.io",
      "Federal Register of Legislation",
      "OAIC Guidelines",
      "Compliance Rules",
    ],
  })
  const [showFilters, setShowFilters] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [documentContent, setDocumentContent] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load saved sources from localStorage on component mount
  useEffect(() => {
    const savedSourcesFromStorage = localStorage.getItem("savedLegalSources")
    if (savedSourcesFromStorage) {
      setSavedSources(JSON.parse(savedSourcesFromStorage))
    }

    const searchHistoryFromStorage = localStorage.getItem("legalSearchHistory")
    if (searchHistoryFromStorage) {
      setSearchHistory(JSON.parse(searchHistoryFromStorage))
    }

    // Simulate new legal updates notification
    setTimeout(() => {
      setNotificationCount(3)
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }, 3000)
  }, [])

  // Save to localStorage when savedSources changes
  useEffect(() => {
    localStorage.setItem("savedLegalSources", JSON.stringify(savedSources))
  }, [savedSources])

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem("legalSearchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    const trimmedTerm = term.trim()

    if (trimmedTerm === "") {
      setRawSearchResults([])
      setSearchResults([])
      return
    }

    if (!searchHistory.includes(trimmedTerm)) {
      setSearchHistory((prev) => [trimmedTerm, ...prev].slice(0, 10))
    }

    setIsSearching(true)

    try {
      const response = await searchLegalSources({ term: trimmedTerm, filters })
      const normalizedAllResults = response.allResults.map((result) => normalizeResult(result))

      setRawSearchResults(normalizedAllResults)
      setSearchResults(filterResultsBySearchFilters(normalizedAllResults, filters))

      if (response.metadata?.availableFilters) {
        const available = response.metadata.availableFilters
        setAvailableFilters((prev) => ({
          jurisdictions: available.jurisdictions.length > 0 ? available.jurisdictions : prev.jurisdictions,
          types: available.types.length > 0 ? available.types : prev.types,
          years: available.years.length > 0 ? available.years : prev.years,
          relevance: available.relevance.length > 0 ? available.relevance : prev.relevance,
          sources: available.sources.length > 0 ? available.sources : prev.sources,
        }))
      }
    } catch (error) {
      console.error("Failed to search legal sources", error)
      setRawSearchResults([])
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (rawSearchResults.length === 0) {
      setSearchResults(rawSearchResults)
      return
    }

    setSearchResults(filterResultsBySearchFilters(rawSearchResults, filters))
  }, [filters, rawSearchResults])

  const handleSaveSource = (source: LegalSource) => {
    if (!savedSources.some((saved) => saved.id === source.id)) {
      const entry: LegalSource = {
        ...source,
        dateAccessed: source.dateAccessed || new Date().toISOString().split("T")[0],
        tags: source.tags || [],
      }

      setSavedSources((prev) => [...prev, entry])
      // Show temporary success message
      const notification = document.getElementById("save-notification")
      if (notification) {
        notification.classList.remove("opacity-0")
        notification.classList.add("opacity-100")
        setTimeout(() => {
          notification.classList.remove("opacity-100")
          notification.classList.add("opacity-0")
        }, 2000)
      }
    }
  }

  const handleRemoveSavedSource = (sourceId: string) => {
    setSavedSources((prev) => prev.filter((source) => source.id !== sourceId))
  }

  const handleViewDocument = (source: LegalSource) => {
    setSelectedDocument(source)
    setActiveTab("document")

    // Simulate fetching document content
    setDocumentContent(null)
    setTimeout(() => {
      if (source.id === "leg-002") {
        // Use the Road Safety Act example from austliiDOMStructure
        setDocumentContent(JSON.stringify(austliiDOMStructure.documentStructure))
      } else {
        setDocumentContent("Sample document content for " + source.title)
      }
    }, 1000)
  }

  const handleClearFilters = () => {
    setFilters({
      jurisdictions: [],
      types: [],
      years: [],
      relevance: [],
      sources: [],
    })
  }

  const handleToggleFilter = (filterType: keyof SearchFilters, value: any) => {
    setFilters((prev) => {
      const currentFilters = [...prev[filterType]]
      const index = currentFilters.indexOf(value)

      if (index === -1) {
        currentFilters.push(value)
      } else {
        currentFilters.splice(index, 1)
      }

      return {
        ...prev,
        [filterType]: currentFilters,
      }
    })
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0)
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    // Show temporary success message
    const notification = document.getElementById("copy-notification")
    if (notification) {
      notification.classList.remove("opacity-0")
      notification.classList.add("opacity-100")
      setTimeout(() => {
        notification.classList.remove("opacity-100")
        notification.classList.add("opacity-0")
      }, 2000)
    }
  }

  const renderRelevanceBadge = (relevance: string) => {
    const colorMap = {
      High: "bg-green-100 text-green-800",
      Medium: "bg-amber-100 text-amber-800",
      Low: "bg-gray-100 text-gray-800",
    }

    return <Badge className={colorMap[relevance as keyof typeof colorMap]}>{relevance}</Badge>
  }

  const handleCreateCitation = (source: LegalSource) => {
    setActiveTab("citations")
  }

  return (
    <Card className="border-pink-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-pink-800">Legal Information Access</CardTitle>
            <CardDescription>Real-time access to Australian legal resources</CardDescription>
          </div>
          <div className="relative">
            <BookOpen className="h-6 w-6 text-pink-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {notificationCount}
              </span>
            )}
          </div>
        </div>
        {showNotification && (
          <div className="mt-2 animate-fade-in rounded-md bg-blue-50 p-2 text-sm text-blue-800 shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <span>
                <span className="font-medium">New legal updates available!</span> 3 recent changes may affect your
                compliance rules.
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowNotification(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-t-none bg-gray-100 p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              Legal Search
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              Saved Sources
            </TabsTrigger>
            <TabsTrigger
              value="document"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              Document Viewer
            </TabsTrigger>
            <TabsTrigger
              value="citations"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              <Quote className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Citations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6">
            <div className="space-y-4">
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                <h3 className="font-medium text-pink-800 mb-2">Open Access to Legal Information</h3>
                <p className="text-pink-700 mb-3">
                  Our framework leverages Australia's open access to legal information, integrating with authoritative
                  legal databases to ensure compliance with current legislation and case law.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-pink-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="bg-pink-100 p-2 rounded-full mb-2">
                      <Scale className="h-5 w-5 text-pink-700" />
                    </div>
                    <h4 className="font-medium text-pink-800 mb-1">Case Law</h4>
                    <p className="text-pink-600">Access to court decisions and precedents</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-pink-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="bg-pink-100 p-2 rounded-full mb-2">
                      <FileText className="h-5 w-5 text-pink-700" />
                    </div>
                    <h4 className="font-medium text-pink-800 mb-1">Legislation</h4>
                    <p className="text-pink-600">Current and historical statutory law</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-pink-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="bg-pink-100 p-2 rounded-full mb-2">
                      <Database className="h-5 w-5 text-pink-700" />
                    </div>
                    <h4 className="font-medium text-pink-800 mb-1">Regulatory Guidance</h4>
                    <p className="text-pink-600">Official interpretations and guidelines</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Database className="h-4 w-4 mr-2 text-pink-600" />
                    Integrated Legal Sources
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm text-blue-700 hover:underline cursor-pointer">AustLII</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm text-blue-700 hover:underline cursor-pointer">Jade.io</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm text-blue-700 hover:underline cursor-pointer">
                          Federal Register of Legislation
                        </span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm text-blue-700 hover:underline cursor-pointer">OAIC Guidelines</span>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">Secondary</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-pink-600" />
                    Legal Information Benefits
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pink-100 flex items-center justify-center mr-2 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 text-pink-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Real-time Updates:</span> Automatic integration of new legal
                        developments
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pink-100 flex items-center justify-center mr-2 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 text-pink-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Contextual Relevance:</span> Legal information linked to specific
                        compliance rules
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pink-100 flex items-center justify-center mr-2 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 text-pink-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Transparent Citations:</span> All compliance rules linked to
                        authoritative sources
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  DataLex Integration
                </h3>
                <p className="text-blue-700 mb-3">
                  Access AustLII's DataLex tools directly from our framework to import legislative sections and develop
                  rule-based legal applications.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.open("/datalex", "_blank")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Open DataLex Tools
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("http://austlii.community/wiki/DataLex/", "_blank")}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Learn More About DataLex
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Legal Information Disclaimer</h3>
                    <p className="text-sm text-gray-700">
                      While our system provides access to legal information, it does not constitute legal advice.
                      Organizations should consult with qualified legal professionals for specific compliance questions.
                      The framework aims to facilitate compliance but does not guarantee legal outcomes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => {
                    setActiveTab("search")
                    setTimeout(() => {
                      if (searchInputRef.current) {
                        searchInputRef.current.focus()
                      }
                    }, 100)
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Start Searching Legal Resources
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="p-6">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-4">Search Australian Legal Resources</h3>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <SearchBar
                      onSearch={handleSearch}
                      placeholder="Search for legislation, cases, or legal concepts..."
                      className="w-full"
                      ref={searchInputRef}
                    />
                  </div>

                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`relative ${getActiveFilterCount() > 0 ? "border-pink-300 bg-pink-50" : ""}`}
                              >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                                {getActiveFilterCount() > 0 && (
                                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-xs text-white">
                                    {getActiveFilterCount()}
                                  </span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4" align="end">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">Filter Results</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="h-8 px-2 text-xs"
                                  >
                                    Clear All
                                  </Button>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium mb-2">Jurisdiction</h5>
                                  <div className="grid grid-cols-3 gap-2">
                                    {availableFilters.jurisdictions.map((jurisdiction) => (
                                      <div key={jurisdiction} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`jurisdiction-${jurisdiction}`}
                                          checked={filters.jurisdictions.includes(jurisdiction)}
                                          onCheckedChange={() => handleToggleFilter("jurisdictions", jurisdiction)}
                                        />
                                        <Label htmlFor={`jurisdiction-${jurisdiction}`} className="text-sm">
                                          {jurisdiction}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h5 className="text-sm font-medium mb-2">Document Type</h5>
                                  <div className="grid grid-cols-2 gap-2">
                                    {availableFilters.types.map((type) => (
                                      <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`type-${type}`}
                                          checked={filters.types.includes(type)}
                                          onCheckedChange={() => handleToggleFilter("types", type)}
                                        />
                                        <Label htmlFor={`type-${type}`} className="text-sm capitalize">
                                          {type}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h5 className="text-sm font-medium mb-2">Relevance</h5>
                                  <div className="flex flex-col gap-2">
                                    {availableFilters.relevance.map((relevance) => (
                                      <div key={relevance} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`relevance-${relevance}`}
                                          checked={filters.relevance.includes(relevance)}
                                          onCheckedChange={() => handleToggleFilter("relevance", relevance)}
                                        />
                                        <Label htmlFor={`relevance-${relevance}`} className="text-sm">
                                          {relevance}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h5 className="text-sm font-medium mb-2">Source</h5>
                                  <div className="flex flex-col gap-2">
                                    {availableFilters.sources.map((source) => (
                                      <div key={source} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`source-${source}`}
                                          checked={filters.sources.includes(source)}
                                          onCheckedChange={() => handleToggleFilter("sources", source)}
                                        />
                                        <Label htmlFor={`source-${source}`} className="text-sm">
                                          {source}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Filter search results</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline">
                                <History className="h-4 w-4 mr-2" />
                                History
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-0" align="end">
                              <div className="p-2">
                                <h4 className="font-medium p-2">Recent Searches</h4>
                                {searchHistory.length > 0 ? (
                                  <div className="max-h-60 overflow-auto">
                                    {searchHistory.map((term, index) => (
                                      <Button
                                        key={index}
                                        variant="ghost"
                                        className="w-full justify-start text-left h-auto py-2 px-2"
                                        onClick={() => handleSearch(term)}
                                      >
                                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="truncate">{term}</span>
                                      </Button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 p-2">No recent searches</p>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View search history</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {isSearching ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
                    <span className="ml-2 text-lg text-gray-600">Searching legal databases...</span>
                  </div>
                ) : searchTerm && searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No results found</h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Try different keywords or broaden your search terms to find relevant legal information.
                    </p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Search Results</h4>
                      <Badge variant="outline">{searchResults.length} results found</Badge>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {searchResults.map((result) => (
                        <AccordionItem key={result.id} value={result.id} className="border-b border-gray-200 py-2">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex flex-col items-start text-left">
                              <div className="flex items-center">
                                <span className="font-medium">{result.title}</span>
                                <Badge className="ml-2 bg-gray-100 text-gray-800 capitalize">{result.type}</Badge>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {result.citation || result.section} ({result.year}) -{" "}
                                {result.court || result.jurisdiction}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 pb-4 space-y-4">
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start">
                                  <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <p className="text-gray-700">{result.summary}</p>
                                </div>
                              </div>

                              {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {result.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="bg-gray-50">
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-700 mr-2">Source:</span>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-800">
                                    {result.source}
                                  </Badge>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-700 mr-2">Relevance:</span>
                                  {renderRelevanceBadge(result.relevance)}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 justify-end">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-gray-700 border-gray-200 hover:bg-gray-50"
                                        onClick={() => handleSaveSource(result)}
                                      >
                                        <BookmarkPlus className="h-4 w-4 mr-1" />
                                        Save
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Save to your collection</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-gray-700 border-gray-200 hover:bg-gray-50"
                                        onClick={() => result.url && handleCopyLink(result.url)}
                                      >
                                        <Copy className="h-4 w-4 mr-1" />
                                        Copy Link
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Copy link to clipboard</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-gray-700 border-gray-200 hover:bg-gray-50"
                                        onClick={() => handleCreateCitation(result)}
                                      >
                                        <Quote className="h-4 w-4 mr-1" />
                                        Cite
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Generate citation</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-pink-700 border-pink-200 hover:bg-pink-50"
                                  onClick={() => handleViewDocument(result)}
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View Document
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Search Australian Legal Resources</h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Enter keywords to search across legislation, case law, and regulatory guidance from authoritative
                      Australian legal sources.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="p-6">
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Saved Legal Sources</h3>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" disabled={savedSources.length === 0}>
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Export saved sources as CSV</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {savedSources.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No Saved Sources</h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Save important legal sources for quick reference. They will appear here for easy access.
                    </p>
                    <Button className="mt-4 bg-pink-600 hover:bg-pink-700" onClick={() => setActiveTab("search")}>
                      <Search className="h-4 w-4 mr-2" />
                      Search Legal Resources
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedSources.map((source) => (
                      <div key={source.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{source.title}</h4>
                            <p className="text-sm text-gray-500">
                              {source.citation || source.section} ({source.year}) - {source.jurisdiction}
                            </p>
                          </div>
                          <div className="flex items-start">{renderRelevanceBadge(source.relevance)}</div>
                        </div>

                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{source.summary}</p>

                        {source.tags && source.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {source.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Saved on: {source.dateAccessed}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-red-600"
                              onClick={() => handleRemoveSavedSource(source.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-700"
                              onClick={() => handleCreateCitation(source)}
                            >
                              <Quote className="h-4 w-4 mr-1" />
                              Cite
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-pink-700 border-pink-200 hover:bg-pink-50"
                              onClick={() => handleViewDocument(source)}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="document" className="p-6">
            <div className="space-y-4">
              {selectedDocument ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900">{selectedDocument.title}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedDocument.citation || selectedDocument.section} ({selectedDocument.year}) -{" "}
                          {selectedDocument.jurisdiction}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-700"
                                onClick={() => selectedDocument.url && handleCopyLink(selectedDocument.url)}
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                Copy Link
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy link to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-700"
                                onClick={() => handleSaveSource(selectedDocument)}
                              >
                                <BookmarkPlus className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Save to your collection</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-700"
                                onClick={() => handleCreateCitation(selectedDocument)}
                              >
                                <Quote className="h-4 w-4 mr-1" />
                                Cite
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Generate citation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {documentContent ? (
                      selectedDocument.id === "leg-002" ? (
                        <LegalDocumentViewer html={documentContent} />
                      ) : (
                        <div className="prose max-w-none">
                          <h4 className="text-lg font-medium mb-4">Document Content</h4>
                          <p>{selectedDocument.summary}</p>
                          <p className="text-sm text-gray-500 mt-4">
                            This is a placeholder for the full document content. In a production environment, this would
                            display the complete text of the legal document with proper formatting and citations.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
                        <span className="ml-2 text-lg text-gray-600">Loading document content...</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No Document Selected</h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Search for legal documents and select "View Document" to display the full content here.
                  </p>
                  <Button className="mt-4 bg-pink-600 hover:bg-pink-700" onClick={() => setActiveTab("search")}>
                    <Search className="h-4 w-4 mr-2" />
                    Search Legal Resources
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="citations" className="p-6">
            <LegalCitationGenerator />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Legal Information</DialogTitle>
                  <DialogDescription>
                    Share this legal information with your team or export it for your records.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="share-link">Share Link</Label>
                    <div className="flex gap-2">
                      <Input id="share-link" value="https://au-legis-compliant.framework/legal-information" readOnly />
                      <Button
                        variant="outline"
                        onClick={() => handleCopyLink("https://au-legis-compliant.framework/legal-information")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Export Options</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export as CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardFooter>

      {/* Notifications */}
      <div
        id="save-notification"
        className="fixed bottom-4 right-4 bg-green-100 text-green-800 p-3 rounded-md shadow-md flex items-center opacity-0 transition-opacity duration-300"
      >
        <CheckCircle2 className="h-5 w-5 mr-2" />
        Source saved successfully
      </div>

      <div
        id="copy-notification"
        className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 p-3 rounded-md shadow-md flex items-center opacity-0 transition-opacity duration-300"
      >
        <CheckCircle2 className="h-5 w-5 mr-2" />
        Link copied to clipboard
      </div>
    </Card>
  )
}
