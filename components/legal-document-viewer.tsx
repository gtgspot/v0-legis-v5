"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  type LegalDocument,
  type LegalReference,
  parseAustLIIDocument,
  austliiDOMStructure,
} from "@/lib/austlii-parser"

interface LegalDocumentViewerProps {
  html?: string
  documentUrl?: string
}

export function LegalDocumentViewer({ html, documentUrl }: LegalDocumentViewerProps) {
  const [document, setDocument] = useState<LegalDocument | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string>(documentUrl || "")

  // Load document from HTML if provided
  useEffect(() => {
    if (html) {
      try {
        const parsedDocument = parseAustLIIDocument(html)
        setDocument(parsedDocument)
      } catch (err) {
        setError("Failed to parse document")
        console.error(err)
      }
    }
  }, [html])

  // Function to fetch and parse a document from URL
  const fetchDocument = async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would use a proxy API to fetch the document
      // For demo purposes, we'll use the sample data
      setTimeout(() => {
        setDocument({
          title: austliiDOMStructure.documentStructure.title,
          act: austliiDOMStructure.documentStructure.act,
          year: austliiDOMStructure.documentStructure.year,
          jurisdiction: austliiDOMStructure.documentStructure.jurisdiction,
          sections: [
            {
              id: austliiDOMStructure.documentStructure.section,
              title: austliiDOMStructure.documentStructure.title,
              content: "This section contains provisions related to inspector identification.",
              subsections: austliiDOMStructure.documentStructure.subsections.map((sub) => ({
                id: `${austliiDOMStructure.documentStructure.section}-${sub.number}`,
                number: sub.number,
                content: sub.content,
                references: [],
              })),
              references: austliiDOMStructure.documentStructure.references,
            },
          ],
        })
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError("Failed to fetch document")
      setLoading(false)
      console.error(err)
    }
  }

  // Render references with appropriate styling
  const renderReferences = (references: LegalReference[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {references.map((ref, index) => (
          <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted">
            {ref.text}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Legal Document Viewer</CardTitle>
        <div className="flex gap-2 mt-2">
          <div className="flex-1">
            <Label htmlFor="document-url">Document URL</Label>
            <Input
              id="document-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter AustLII document URL"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={fetchDocument} disabled={loading}>
              {loading ? "Loading..." : "Load Document"}
            </Button>
          </div>
        </div>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      </CardHeader>
      <CardContent>
        {document ? (
          <Tabs defaultValue="document">
            <TabsList className="mb-4">
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
            </TabsList>

            <TabsContent value="document">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{document.title}</h2>
                  <p className="text-muted-foreground">
                    {document.act} ({document.year}) - {document.jurisdiction}
                  </p>
                </div>

                <Separator />

                {document.sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className="text-lg font-semibold">Section {section.id}</h3>
                    <p>{section.content}</p>

                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="subsections">
                        <AccordionTrigger>Subsections</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {section.subsections.map((subsection) => (
                              <div key={subsection.id} className="p-3 bg-muted rounded-md">
                                <p className="font-medium">({subsection.number})</p>
                                <p>{subsection.content}</p>
                                {subsection.references.length > 0 && renderReferences(subsection.references)}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metadata">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Title</h3>
                    <p>{document.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Act</h3>
                    <p>{document.act}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Year</h3>
                    <p>{document.year}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Jurisdiction</h3>
                    <p>{document.jurisdiction}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Sections</h3>
                    <p>{document.sections.length}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Total Subsections</h3>
                    <p>{document.sections.reduce((total, section) => total + section.subsections.length, 0)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="references">
              <div className="space-y-4">
                {document.sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className="font-medium">Section {section.id} References</h3>
                    {section.references.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {section.references.map((ref, index) => (
                          <div key={index} className="p-2 border rounded-md">
                            <div className="flex items-center justify-between">
                              <span>{ref.text}</span>
                              <Badge>{ref.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{ref.href}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No references found</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {loading ? "Loading document..." : "No document loaded. Enter a URL or provide HTML content."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
