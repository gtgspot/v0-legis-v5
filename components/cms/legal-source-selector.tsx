"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, BookOpen, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LegalSourceSelectorProps {
  onAddSource: (source: any) => void
}

export function LegalSourceSelector({ onAddSource }: LegalSourceSelectorProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("search")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedSource, setSelectedSource] = useState<any>(null)
  const [manualSource, setManualSource] = useState({
    type: "legislation",
    title: "",
    sections: "",
    citation: "",
    url: "",
  })

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    // Simulate API search
    setTimeout(() => {
      setIsSearching(false)
      // Mock search results
      setSearchResults([
        {
          id: "leg-001",
          type: "legislation",
          title: "Privacy Act 1988 (Cth)",
          sections: ["s 6", "s 15"],
          url: "https://www.legislation.gov.au/Details/C2021C00452",
        },
        {
          id: "case-001",
          type: "case",
          title: "Privacy Commissioner v Telstra Corporation Limited",
          citation: "[2017] FCAFC 4",
          url: "https://www.judgments.fedcourt.gov.au/judgments/Judgments/fca/full/2017/2017fcafc0004",
        },
        {
          id: "leg-002",
          type: "legislation",
          title: "Australian Consumer Law",
          sections: ["s 18", "s 29"],
          url: "https://www.legislation.gov.au/Details/C2021C00528",
        },
      ])
    }, 1000)
  }

  const handleSelectSource = (source: any) => {
    setSelectedSource(source)
  }

  const handleAddSource = () => {
    if (activeTab === "search" && selectedSource) {
      onAddSource(selectedSource)
      setSelectedSource(null)
      setSearchTerm("")
      setSearchResults([])
    } else if (activeTab === "manual" && manualSource.title) {
      const formattedSource = {
        ...manualSource,
        sections: manualSource.type === "legislation" ? manualSource.sections.split(",").map((s) => s.trim()) : [],
      }
      onAddSource(formattedSource)
      setManualSource({
        type: "legislation",
        title: "",
        sections: "",
        citation: "",
        url: "",
      })
    }
    setOpen(false)
  }

  const handleManualInputChange = (field: string, value: string) => {
    setManualSource((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Legal Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Legal Source</DialogTitle>
          <DialogDescription>
            Link this rule to legislation, case law, or regulatory guidance for traceability.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
            <TabsTrigger
              value="search"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
            >
              Search Sources
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
            >
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search for legislation or case law..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Searching legal databases...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {searchResults.map((source) => (
                  <div
                    key={source.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSource?.id === source.id
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelectSource(source)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {source.type === "legislation" ? (
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                        )}
                        <div>
                          <div className="font-medium">{source.title}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {source.type === "legislation"
                              ? `Sections: ${source.sections.join(", ")}`
                              : `Citation: ${source.citation}`}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          source.type === "legislation" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }
                      >
                        {source.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500">No results found. Try different search terms or add manually.</p>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Search for legislation, cases, or regulatory guidance.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source-type">Source Type</Label>
                <Select value={manualSource.type} onValueChange={(value) => handleManualInputChange("type", value)}>
                  <SelectTrigger id="source-type">
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legislation">Legislation</SelectItem>
                    <SelectItem value="case">Case Law</SelectItem>
                    <SelectItem value="guidance">Regulatory Guidance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source-title">Title</Label>
                <Input
                  id="source-title"
                  placeholder="e.g., Privacy Act 1988 (Cth)"
                  value={manualSource.title}
                  onChange={(e) => handleManualInputChange("title", e.target.value)}
                />
              </div>

              {manualSource.type === "legislation" ? (
                <div className="space-y-2">
                  <Label htmlFor="source-sections">Sections</Label>
                  <Input
                    id="source-sections"
                    placeholder="e.g., s 6, s 15"
                    value={manualSource.sections}
                    onChange={(e) => handleManualInputChange("sections", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Comma-separated list of relevant sections.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="source-citation">Citation</Label>
                  <Input
                    id="source-citation"
                    placeholder="e.g., [2017] FCAFC 4"
                    value={manualSource.citation}
                    onChange={(e) => handleManualInputChange("citation", e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="source-url">URL (Optional)</Label>
                <Input
                  id="source-url"
                  placeholder="e.g., https://www.legislation.gov.au/Details/C2021C00452"
                  value={manualSource.url}
                  onChange={(e) => handleManualInputChange("url", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSource}
            disabled={(activeTab === "search" && !selectedSource) || (activeTab === "manual" && !manualSource.title)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Add Source
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
