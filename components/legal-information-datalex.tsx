"use client"

import { Button } from "@/components/ui/button"
import { Code, ExternalLink } from "lucide-react"
import Link from "next/link"

export function LegalInformationDataLex() {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
      <h3 className="font-medium text-blue-800 mb-2">DataLex Integration</h3>
      <p className="text-blue-700 mb-3">
        Our framework integrates with DataLex, AustLII's platform for developing rule-based legal applications. Use
        DataLex to import legislative sections from AustLII and create rule-based applications.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/datalex">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Code className="h-4 w-4 mr-2" />
            Open DataLex Tools
          </Button>
        </Link>
        <Button
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
          onClick={() => window.open("http://austlii.community/wiki/DataLex/", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Learn More
        </Button>
      </div>
    </div>
  )
}
