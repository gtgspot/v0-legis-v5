import { LegalDocumentViewer } from "@/components/legal-document-viewer"
import { LegalCitationGenerator } from "@/components/legal-citation-generator"
import { austliiDOMStructure } from "@/lib/austlii-parser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LegalDocumentsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Legal Document Tools</h1>
      <p className="text-muted-foreground mb-8">
        This page provides tools for working with legal documents in the AU-Legis-Compliant Framework, including
        document viewing and citation generation.
      </p>

      <Tabs defaultValue="viewer" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="viewer">Document Viewer</TabsTrigger>
          <TabsTrigger value="citations">Citation Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="viewer">
          <div className="grid gap-8">
            <LegalDocumentViewer documentUrl="https://www.austlii.edu.au/au/legis/vic/consol_act/rsa1986125/s116.html" />
          </div>
        </TabsContent>

        <TabsContent value="citations">
          <div className="grid gap-8">
            <LegalCitationGenerator />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">About AustLII Document Structure</h2>
        <p className="mb-4">
          The AU-Legis-Compliant Framework includes a parser for AustLII documents that understands the DOM structure of
          legal documents. This allows for accurate extraction of sections, subsections, and references.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Supported Jurisdictions</h3>
            <ul className="space-y-2">
              {austliiDOMStructure.jurisdictions.map((jurisdiction) => (
                <li key={jurisdiction.code} className="flex items-center gap-2">
                  <span className="font-medium">{jurisdiction.name}:</span>
                  <span>{jurisdiction.fullName}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Document Elements</h3>
            <ul className="space-y-2">
              {austliiDOMStructure.domNodes
                .filter((node) =>
                  ["page-header", "page-title", "page-content", "page-main", "panel-jurisdiction"].includes(node.id),
                )
                .map((node) => (
                  <li key={node.id} className="flex items-center gap-2">
                    <span className="font-medium">#{node.id}:</span>
                    <span>{node.type}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
