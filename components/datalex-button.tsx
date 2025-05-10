"use client"

import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DataLexButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/datalex">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Code className="h-4 w-4 mr-2" />
              DataLex
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open DataLex Application Development Tools</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
