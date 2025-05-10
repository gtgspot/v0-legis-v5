"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Copy, Check, BookOpen, FileText, Scale, Book, Download, Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types for citation generation
interface CitationFields {
  case: {
    caseName: string
    year: string
    volume: string
    reporter: string
    startPage: string
    court: string
    judgmentDate: string
    mediumNeutral: string
    judges: string
  }
  legislation: {
    title: string
    year: string
    jurisdiction: string
    section: string
    division: string
    part: string
    chapter: string
    schedule: string
    pinpoint: string
  }
  journal: {
    author: string
    title: string
    year: string
    volume: string
    journal: string
    startPage: string
    pinpoint: string
  }
  book: {
    author: string
    title: string
    edition: string
    publisher: string
    year: string
    page: string
  }
}

// Citation style options
type CitationStyle = "AGLC" | "APA" | "MLA" | "Harvard"

export function LegalCitationGenerator() {
  const [activeTab, setActiveTab] = useState<"case" | "legislation" | "journal" | "book">("case")
  const [citationStyle, setCitationStyle] = useState<CitationStyle>("AGLC")
  const [fields, setFields] = useState<CitationFields>({
    case: {
      caseName: "",
      year: "",
      volume: "",
      reporter: "",
      startPage: "",
      court: "",
      judgmentDate: "",
      mediumNeutral: "",
      judges: "",
    },
    legislation: {
      title: "",
      year: "",
      jurisdiction: "",
      section: "",
      division: "",
      part: "",
      chapter: "",
      schedule: "",
      pinpoint: "",
    },
    journal: {
      author: "",
      title: "",
      year: "",
      volume: "",
      journal: "",
      startPage: "",
      pinpoint: "",
    },
    book: {
      author: "",
      title: "",
      edition: "",
      publisher: "",
      year: "",
      page: "",
    },
  })
  const [generatedCitation, setGeneratedCitation] = useState<string>("")
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [includeInText, setIncludeInText] = useState<boolean>(false)
  const [inTextCitation, setInTextCitation] = useState<string>("")
  const [recentCitations, setRecentCitations] = useState<string[]>([])

  // Court options for case citations
  const courtOptions = [
    { value: "HCA", label: "High Court of Australia" },
    { value: "FCAFC", label: "Federal Court of Australia (Full Court)" },
    { value: "FCA", label: "Federal Court of Australia" },
    { value: "NSWSC", label: "Supreme Court of New South Wales" },
    { value: "NSWCA", label: "New South Wales Court of Appeal" },
    { value: "VSC", label: "Supreme Court of Victoria" },
    { value: "VSCA", label: "Victorian Court of Appeal" },
    { value: "QSC", label: "Supreme Court of Queensland" },
    { value: "QCA", label: "Queensland Court of Appeal" },
    { value: "SASC", label: "Supreme Court of South Australia" },
    { value: "SASCFC", label: "South Australian Supreme Court Full Court" },
    { value: "WASC", label: "Supreme Court of Western Australia" },
    { value: "WASCA", label: "Western Australian Court of Appeal" },
    { value: "TASSC", label: "Supreme Court of Tasmania" },
    { value: "NTSC", label: "Supreme Court of the Northern Territory" },
    { value: "ACTSC", label: "Supreme Court of the Australian Capital Territory" },
  ]

  // Reporter options for case citations
  const reporterOptions = [
    { value: "CLR", label: "Commonwealth Law Reports" },
    { value: "ALR", label: "Australian Law Reports" },
    { value: "ALJR", label: "Australian Law Journal Reports" },
    { value: "FCR", label: "Federal Court Reports" },
    { value: "NSWLR", label: "New South Wales Law Reports" },
    { value: "VR", label: "Victorian Reports" },
    { value: "Qd R", label: "Queensland Reports" },
    { value: "SASR", label: "South Australian State Reports" },
    { value: "WAR", label: "Western Australian Reports" },
    { value: "Tas R", label: "Tasmanian Reports" },
    { value: "NTLR", label: "Northern Territory Law Reports" },
    { value: "ACTR", label: "Australian Capital Territory Reports" },
    { value: "FLR", label: "Federal Law Reports" },
  ]

  // Jurisdiction options for legislation citations
  const jurisdictionOptions = [
    { value: "Cth", label: "Commonwealth" },
    { value: "NSW", label: "New South Wales" },
    { value: "Vic", label: "Victoria" },
    { value: "Qld", label: "Queensland" },
    { value: "SA", label: "South Australia" },
    { value: "WA", label: "Western Australia" },
    { value: "Tas", label: "Tasmania" },
    { value: "ACT", label: "Australian Capital Territory" },
    { value: "NT", label: "Northern Territory" },
  ]

  // Handle field changes
  const handleFieldChange = (category: keyof CitationFields, field: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  // Generate citation based on the active tab and citation style
  const generateCitation = () => {
    let citation = ""
    let inText = ""

    switch (activeTab) {
      case "case":
        citation = generateCaseCitation()
        inText = generateCaseInTextCitation()
        break
      case "legislation":
        citation = generateLegislationCitation()
        inText = generateLegislationInTextCitation()
        break
      case "journal":
        citation = generateJournalCitation()
        inText = generateJournalInTextCitation()
        break
      case "book":
        citation = generateBookCitation()
        inText = generateBookInTextCitation()
        break
    }

    setGeneratedCitation(citation)
    setInTextCitation(inText)

    // Add to recent citations if not empty
    if (citation && !recentCitations.includes(citation)) {
      setRecentCitations((prev) => [citation, ...prev].slice(0, 5))
    }
  }

  // Generate case citation
  const generateCaseCitation = (): string => {
    const { caseName, year, volume, reporter, startPage, court, judgmentDate, mediumNeutral } = fields.case

    if (!caseName) return ""

    switch (citationStyle) {
      case "AGLC":
        // Format: Case Name [Year] Volume Reporter Starting Page
        // or: Case Name (Court, Judgment Date)
        if (reporter && volume && startPage) {
          return `${caseName} [${year}] ${volume} ${reporter} ${startPage}`
        } else if (court && judgmentDate) {
          return `${caseName} (${court}, ${judgmentDate})`
        } else if (mediumNeutral) {
          return `${caseName} [${year}] ${mediumNeutral}`
        }
        return `${caseName} [${year}]`

      case "APA":
        if (reporter && volume && startPage) {
          return `${caseName} (${year}) ${volume} ${reporter} ${startPage}`
        } else if (court && judgmentDate) {
          return `${caseName} (${court}, ${judgmentDate}, ${year})`
        }
        return `${caseName} (${year})`

      default:
        return `${caseName} [${year}] ${volume} ${reporter} ${startPage}`
    }
  }

  // Generate in-text case citation
  const generateCaseInTextCitation = (): string => {
    const { caseName, year } = fields.case

    if (!caseName) return ""

    switch (citationStyle) {
      case "AGLC":
        return `${caseName} (${year})`
      case "APA":
        return `${caseName} (${year})`
      default:
        return `${caseName} (${year})`
    }
  }

  // Generate legislation citation
  const generateLegislationCitation = (): string => {
    const { title, year, jurisdiction, section, division, part, chapter, schedule, pinpoint } = fields.legislation

    if (!title) return ""

    let citation = ""
    let pinpointRef = ""

    // Build pinpoint reference
    if (section) pinpointRef += `s ${section}`
    if (division) pinpointRef += pinpointRef ? `, div ${division}` : `div ${division}`
    if (part) pinpointRef += pinpointRef ? `, pt ${part}` : `pt ${part}`
    if (chapter) pinpointRef += pinpointRef ? `, ch ${chapter}` : `ch ${chapter}`
    if (schedule) pinpointRef += pinpointRef ? `, sch ${schedule}` : `sch ${schedule}`
    if (pinpoint && !section) pinpointRef += pinpointRef ? `, ${pinpoint}` : pinpoint

    switch (citationStyle) {
      case "AGLC":
        citation = `${title} ${year} (${jurisdiction})`
        if (pinpointRef) citation += ` ${pinpointRef}`
        return citation

      case "APA":
        citation = `${title} (${jurisdiction}) ${year}`
        if (pinpointRef) citation += ` ${pinpointRef}`
        return citation

      default:
        citation = `${title} ${year} (${jurisdiction})`
        if (pinpointRef) citation += ` ${pinpointRef}`
        return citation
    }
  }

  // Generate in-text legislation citation
  const generateLegislationInTextCitation = (): string => {
    const { title, year, jurisdiction, section } = fields.legislation

    if (!title) return ""

    switch (citationStyle) {
      case "AGLC":
        return section ? `${title} ${year} (${jurisdiction}) s ${section}` : `${title} ${year} (${jurisdiction})`
      case "APA":
        return section ? `${title} (${jurisdiction}, ${year}) s ${section}` : `${title} (${jurisdiction}, ${year})`
      default:
        return section ? `${title} ${year} (${jurisdiction}) s ${section}` : `${title} ${year} (${jurisdiction})`
    }
  }

  // Generate journal article citation
  const generateJournalCitation = (): string => {
    const { author, title, year, volume, journal, startPage, pinpoint } = fields.journal

    if (!author || !title || !journal) return ""

    let citation = ""
    const pinpointRef = pinpoint ? `, ${pinpoint}` : ""

    switch (citationStyle) {
      case "AGLC":
        citation = `${author}, '${title}' (${year})`
        if (volume) citation += ` ${volume}`
        citation += ` ${journal} ${startPage}${pinpointRef}`
        return citation

      case "APA":
        citation = `${author} (${year}). ${title}. ${journal}`
        if (volume) citation += `, ${volume}`
        citation += `, ${startPage}${pinpointRef}`
        return citation

      default:
        citation = `${author}, '${title}' (${year})`
        if (volume) citation += ` ${volume}`
        citation += ` ${journal} ${startPage}${pinpointRef}`
        return citation
    }
  }

  // Generate in-text journal citation
  const generateJournalInTextCitation = (): string => {
    const { author, year } = fields.journal

    if (!author) return ""

    switch (citationStyle) {
      case "AGLC":
        return `${author} (${year})`
      case "APA":
        return `${author} (${year})`
      default:
        return `${author} (${year})`
    }
  }

  // Generate book citation
  const generateBookCitation = (): string => {
    const { author, title, edition, publisher, year, page } = fields.book

    if (!author || !title) return ""

    let citation = ""
    const pageRef = page ? `, ${page}` : ""

    switch (citationStyle) {
      case "AGLC":
        citation = `${author}, ${title}`
        if (edition && edition !== "1") citation += ` (${edition} ed, `
        else citation += ` (`
        citation += `${publisher}, ${year})${pageRef}`
        return citation

      case "APA":
        citation = `${author} (${year}). ${title}`
        if (edition && edition !== "1") citation += ` (${edition} ed.)`
        citation += `. ${publisher}${pageRef}`
        return citation

      default:
        citation = `${author}, ${title}`
        if (edition && edition !== "1") citation += ` (${edition} ed, `
        else citation += ` (`
        citation += `${publisher}, ${year})${pageRef}`
        return citation
    }
  }

  // Generate in-text book citation
  const generateBookInTextCitation = (): string => {
    const { author, year, page } = fields.book

    if (!author) return ""

    switch (citationStyle) {
      case "AGLC":
        return page ? `${author} (${year}) ${page}` : `${author} (${year})`
      case "APA":
        return page ? `${author} (${year}, p. ${page})` : `${author} (${year})`
      default:
        return page ? `${author} (${year}) ${page}` : `${author} (${year})`
    }
  }

  // Copy citation to clipboard
  const handleCopyCitation = () => {
    const textToCopy = includeInText ? `${inTextCitation}\n\n${generatedCitation}` : generatedCitation
    navigator.clipboard.writeText(textToCopy)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // Reset form fields
  const handleReset = () => {
    setFields({
      ...fields,
      [activeTab]: Object.fromEntries(Object.keys(fields[activeTab]).map((key) => [key, ""])),
    })
    setGeneratedCitation("")
    setInTextCitation("")
  }

  // Render form fields based on active tab
  const renderFormFields = () => {
    switch (activeTab) {
      case "case":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseName">
                  Case Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="caseName"
                  placeholder="e.g., Smith v Jones"
                  value={fields.case.caseName}
                  onChange={(e) => handleFieldChange("case", "caseName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year"
                  placeholder="e.g., 2023"
                  value={fields.case.year}
                  onChange={(e) => handleFieldChange("case", "year", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="court">Court</Label>
                <Select value={fields.case.court} onValueChange={(value) => handleFieldChange("case", "court", value)}>
                  <SelectTrigger id="court">
                    <SelectValue placeholder="Select court" />
                  </SelectTrigger>
                  <SelectContent>
                    {courtOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  id="volume"
                  placeholder="e.g., 123"
                  value={fields.case.volume}
                  onChange={(e) => handleFieldChange("case", "volume", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporter">Reporter</Label>
                <Select
                  value={fields.case.reporter}
                  onValueChange={(value) => handleFieldChange("case", "reporter", value)}
                >
                  <SelectTrigger id="reporter">
                    <SelectValue placeholder="Select reporter" />
                  </SelectTrigger>
                  <SelectContent>
                    {reporterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startPage">Starting Page</Label>
                <Input
                  id="startPage"
                  placeholder="e.g., 456"
                  value={fields.case.startPage}
                  onChange={(e) => handleFieldChange("case", "startPage", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="judgmentDate">Judgment Date</Label>
                <Input
                  id="judgmentDate"
                  placeholder="e.g., 15 March 2023"
                  value={fields.case.judgmentDate}
                  onChange={(e) => handleFieldChange("case", "judgmentDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediumNeutral">Medium Neutral Citation</Label>
                <Input
                  id="mediumNeutral"
                  placeholder="e.g., [2023] HCA 1"
                  value={fields.case.mediumNeutral}
                  onChange={(e) => handleFieldChange("case", "mediumNeutral", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="judges">Judges</Label>
              <Input
                id="judges"
                placeholder="e.g., Kiefel CJ, Gageler, Keane, Gordon and Edelman JJ"
                value={fields.case.judges}
                onChange={(e) => handleFieldChange("case", "judges", e.target.value)}
              />
            </div>
          </div>
        )

      case "legislation":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Privacy Act"
                  value={fields.legislation.title}
                  onChange={(e) => handleFieldChange("legislation", "title", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year"
                  placeholder="e.g., 1988"
                  value={fields.legislation.year}
                  onChange={(e) => handleFieldChange("legislation", "year", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction">
                  Jurisdiction <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={fields.legislation.jurisdiction}
                  onValueChange={(value) => handleFieldChange("legislation", "jurisdiction", value)}
                >
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  placeholder="e.g., 6"
                  value={fields.legislation.section}
                  onChange={(e) => handleFieldChange("legislation", "section", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="part">Part</Label>
                <Input
                  id="part"
                  placeholder="e.g., IV"
                  value={fields.legislation.part}
                  onChange={(e) => handleFieldChange("legislation", "part", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                <Input
                  id="division"
                  placeholder="e.g., 3"
                  value={fields.legislation.division}
                  onChange={(e) => handleFieldChange("legislation", "division", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chapter">Chapter</Label>
                <Input
                  id="chapter"
                  placeholder="e.g., 2"
                  value={fields.legislation.chapter}
                  onChange={(e) => handleFieldChange("legislation", "chapter", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  placeholder="e.g., 1"
                  value={fields.legislation.schedule}
                  onChange={(e) => handleFieldChange("legislation", "schedule", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pinpoint">Other Pinpoint Reference</Label>
              <Input
                id="pinpoint"
                placeholder="e.g., cl 5"
                value={fields.legislation.pinpoint}
                onChange={(e) => handleFieldChange("legislation", "pinpoint", e.target.value)}
              />
            </div>
          </div>
        )

      case "journal":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="author">
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                placeholder="e.g., Jane Smith"
                value={fields.journal.author}
                onChange={(e) => handleFieldChange("journal", "author", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Article Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., The Evolution of Privacy Law in Australia"
                value={fields.journal.title}
                onChange={(e) => handleFieldChange("journal", "title", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year"
                  placeholder="e.g., 2023"
                  value={fields.journal.year}
                  onChange={(e) => handleFieldChange("journal", "year", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  id="volume"
                  placeholder="e.g., 45"
                  value={fields.journal.volume}
                  onChange={(e) => handleFieldChange("journal", "volume", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startPage">
                  Starting Page <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startPage"
                  placeholder="e.g., 123"
                  value={fields.journal.startPage}
                  onChange={(e) => handleFieldChange("journal", "startPage", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="journal">
                Journal Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="journal"
                placeholder="e.g., Melbourne University Law Review"
                value={fields.journal.journal}
                onChange={(e) => handleFieldChange("journal", "journal", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pinpoint">Pinpoint Reference</Label>
              <Input
                id="pinpoint"
                placeholder="e.g., 125"
                value={fields.journal.pinpoint}
                onChange={(e) => handleFieldChange("journal", "pinpoint", e.target.value)}
              />
            </div>
          </div>
        )

      case "book":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="author">
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                placeholder="e.g., John Smith"
                value={fields.book.author}
                onChange={(e) => handleFieldChange("book", "author", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Book Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Australian Constitutional Law: Principles and Cases"
                value={fields.book.title}
                onChange={(e) => handleFieldChange("book", "title", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edition">Edition</Label>
                <Input
                  id="edition"
                  placeholder="e.g., 3"
                  value={fields.book.edition}
                  onChange={(e) => handleFieldChange("book", "edition", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year"
                  placeholder="e.g., 2023"
                  value={fields.book.year}
                  onChange={(e) => handleFieldChange("book", "year", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="page">Page Reference</Label>
                <Input
                  id="page"
                  placeholder="e.g., 42"
                  value={fields.book.page}
                  onChange={(e) => handleFieldChange("book", "page", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">
                Publisher <span className="text-red-500">*</span>
              </Label>
              <Input
                id="publisher"
                placeholder="e.g., Oxford University Press"
                value={fields.book.publisher}
                onChange={(e) => handleFieldChange("book", "publisher", e.target.value)}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Legal Citation Generator</CardTitle>
            <CardDescription>
              Generate properly formatted legal citations following standard style guides
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="citation-style" className="mr-2">
              Style
            </Label>
            <Select value={citationStyle} onValueChange={(value: CitationStyle) => setCitationStyle(value)}>
              <SelectTrigger id="citation-style" className="w-[140px]">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AGLC">AGLC</SelectItem>
                <SelectItem value="APA">APA</SelectItem>
                <SelectItem value="MLA">MLA</SelectItem>
                <SelectItem value="Harvard">Harvard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(value: "case" | "legislation" | "journal" | "book") => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="case" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Case</span>
            </TabsTrigger>
            <TabsTrigger value="legislation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Legislation</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="book" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Book</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="case" className="space-y-4 mt-4">
            {renderFormFields()}
          </TabsContent>

          <TabsContent value="legislation" className="space-y-4 mt-4">
            {renderFormFields()}
          </TabsContent>

          <TabsContent value="journal" className="space-y-4 mt-4">
            {renderFormFields()}
          </TabsContent>

          <TabsContent value="book" className="space-y-4 mt-4">
            {renderFormFields()}
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-in-text"
            checked={includeInText}
            onCheckedChange={(checked) => setIncludeInText(checked as boolean)}
          />
          <Label htmlFor="include-in-text">Include in-text citation</Label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={generateCitation} className="bg-pink-600 hover:bg-pink-700">
            Generate Citation
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {generatedCitation && (
          <div className="mt-4 space-y-4">
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2">Generated Citation</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                {includeInText && inTextCitation && (
                  <>
                    <p className="mb-2">
                      <span className="font-medium">In-text:</span> {inTextCitation}
                    </p>
                    <p>
                      <span className="font-medium">Reference list:</span> {generatedCitation}
                    </p>
                  </>
                )}
                {(!includeInText || !inTextCitation) && <p>{generatedCitation}</p>}
                <div className="absolute top-2 right-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopyCitation}>
                          {copySuccess ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copySuccess ? "Copied!" : "Copy to clipboard"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        )}

        {recentCitations.length > 0 && (
          <div className="mt-4 space-y-4">
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2">Recent Citations</h3>
              <div className="space-y-2">
                {recentCitations.map((citation, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm relative">
                    <p>{citation}</p>
                    <div className="absolute top-2 right-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                navigator.clipboard.writeText(citation)
                                setCopySuccess(true)
                                setTimeout(() => setCopySuccess(false), 2000)
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-4">
        <div className="text-xs text-gray-500">
          <p>Based on the Australian Guide to Legal Citation (AGLC) 4th Edition</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
