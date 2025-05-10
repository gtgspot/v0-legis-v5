/**
 * AustLII Document Parser
 *
 * This utility parses AustLII legal documents based on their DOM structure.
 * It extracts sections, subsections, and references from the HTML content.
 */

export interface LegalReference {
  type: "section" | "act" | "regulation" | "other"
  text: string
  href: string
}

export interface LegalSection {
  id: string
  title: string
  content: string
  subsections: LegalSubsection[]
  references: LegalReference[]
}

export interface LegalSubsection {
  id: string
  number: string
  content: string
  references: LegalReference[]
}

export interface LegalDocument {
  title: string
  act: string
  year: number
  jurisdiction: string
  sections: LegalSection[]
}

/**
 * Parse an AustLII HTML document
 * @param html The HTML content of the AustLII document
 * @returns Parsed legal document structure
 */
export function parseAustLIIDocument(html: string): LegalDocument {
  // Create a DOM parser
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // Extract document title
  const titleElement = doc.querySelector("#page-title") || doc.querySelector("h1")
  const title = titleElement ? titleElement.textContent?.trim() || "" : ""

  // Extract act information from the title or URL
  const actMatch = title.match(/([A-Z\s]+)\s+ACT\s+(\d{4})/i)
  const act = actMatch ? actMatch[1].trim() : ""
  const year = actMatch ? Number.parseInt(actMatch[2], 10) : 0

  // Determine jurisdiction from URL or content
  const urlElement = doc.querySelector("footer small")
  const url = urlElement ? urlElement.textContent || "" : ""
  const jurisdictionMatch = url.match(/au\/legis\/([a-z]+)\//i)
  const jurisdiction = jurisdictionMatch ? jurisdictionMatch[1].toUpperCase() : ""

  // Extract the main content
  const mainContent = doc.querySelector("#page-main article.the-document")

  // Parse sections
  const sections: LegalSection[] = []

  if (mainContent) {
    // Find section headers
    const sectionHeaders = mainContent.querySelectorAll("h3")

    for (let i = 0; i < sectionHeaders.length; i++) {
      const header = sectionHeaders[i]
      const sectionTitle = header.textContent?.trim() || ""
      const sectionId = sectionTitle.match(/SECT\s+(\d+)/i)?.[1] || ""

      // Find content until the next section header
      let content = ""
      let currentNode = header.nextElementSibling
      const subsections: LegalSubsection[] = []
      const references: LegalReference[] = []

      while (currentNode && currentNode.tagName !== "H3") {
        // Check if this is a subsection
        if (currentNode.tagName === "P" && currentNode.textContent?.trim().match(/^\s*$$\d+$$/)) {
          const subsectionText = currentNode.textContent?.trim() || ""
          const subsectionNumber = subsectionText.match(/^\s*$$(\d+)$$/)?.[1] || ""

          // Extract references in this subsection
          const subsectionRefs: LegalReference[] = []
          const links = currentNode.querySelectorAll("a")

          links.forEach((link) => {
            const href = link.getAttribute("href") || ""
            const text = link.textContent?.trim() || ""
            let type: "section" | "act" | "regulation" | "other" = "other"

            if (href.includes("s") && /^\d+/.test(href.replace("s", ""))) {
              type = "section"
            } else if (href.includes("act")) {
              type = "act"
            } else if (href.includes("reg")) {
              type = "regulation"
            }

            subsectionRefs.push({ type, text, href })
          })

          subsections.push({
            id: `${sectionId}-${subsectionNumber}`,
            number: subsectionNumber,
            content: subsectionText,
            references: subsectionRefs,
          })
        } else if (currentNode.tagName === "A" || currentNode.querySelector("a")) {
          // Extract references
          const links = currentNode.tagName === "A" ? [currentNode] : currentNode.querySelectorAll("a")

          links.forEach((link) => {
            const href = link.getAttribute("href") || ""
            const text = link.textContent?.trim() || ""
            let type: "section" | "act" | "regulation" | "other" = "other"

            if (href.includes("s") && /^\d+/.test(href.replace("s", ""))) {
              type = "section"
            } else if (href.includes("act")) {
              type = "act"
            } else if (href.includes("reg")) {
              type = "regulation"
            }

            references.push({ type, text, href })
          })
        }

        if (currentNode.textContent?.trim()) {
          content += currentNode.textContent.trim() + "\n"
        }

        currentNode = currentNode.nextElementSibling
      }

      sections.push({
        id: sectionId,
        title: sectionTitle,
        content: content.trim(),
        subsections,
        references,
      })
    }
  }

  return {
    title,
    act,
    year,
    jurisdiction,
    sections,
  }
}

/**
 * Extract DOM structure from an AustLII document
 * @param html The HTML content of the AustLII document
 * @returns Object containing DOM structure information
 */
export function extractAustLIIDOMStructure(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // Extract all elements with IDs
  const elementsWithIds = doc.querySelectorAll("[id]")
  const domStructure: Record<string, { tag: string; attributes: Record<string, string> }> = {}

  elementsWithIds.forEach((el) => {
    const id = el.getAttribute("id")
    if (id) {
      const attributes: Record<string, string> = {}

      Array.from(el.attributes).forEach((attr) => {
        if (attr.name !== "id") {
          attributes[attr.name] = attr.value
        }
      })

      domStructure[id] = {
        tag: el.tagName.toLowerCase(),
        attributes,
      }
    }
  })

  return {
    domStructure,
    pageTitle: doc.querySelector("title")?.textContent || "",
    mainContent: doc.querySelector("#page-main")?.innerHTML || "",
    navigation: {
      primary: Array.from(doc.querySelectorAll("#ribbon a")).map((a) => ({
        text: a.textContent?.trim() || "",
        href: a.getAttribute("href") || "",
      })),
      secondary: Array.from(doc.querySelectorAll("#panel-jurisdiction a")).map((a) => ({
        text: a.querySelector("h5")?.textContent?.trim() || "",
        href: a.getAttribute("href") || "",
      })),
    },
  }
}

// AustLII DOM structure based on the provided data
export const austliiDOMStructure = {
  domAttributes: ["id"],
  domNodes: [
    { id: "page-header", type: "header" },
    { id: "primary", type: "div" },
    { id: "page-logo", type: "a", attributes: { href: "/", tabindex: "1" } },
    { id: "page-title", type: "h1" },
    { id: "page-search", type: "div" },
    { id: "database-all", type: "input", attributes: { type: "radio", name: "mask_path", value: "", tabindex: "2" } },
    {
      id: "database-this",
      type: "input",
      attributes: { type: "radio", name: "mask_path", value: "au/legis/vic/consol_act", tabindex: "3" },
    },
    {
      id: "legis-this",
      type: "input",
      attributes: {
        type: "radio",
        name: "mask_path",
        value: "au/legis/vic/consol_act/rsa1986125",
        tabindex: "3",
        checked: "checked",
      },
    },
    {
      id: "database-full",
      type: "input",
      attributes: { type: "radio", name: "method", value: "auto", method: "auto", checked: "checked", tabindex: "6" },
    },
    {
      id: "database-title",
      type: "input",
      attributes: { type: "radio", name: "method", value: "title", tabindex: "7" },
    },
    {
      id: "search-box",
      type: "input",
      attributes: { type: "text", name: "query", placeholder: "Search this legislation only", tabindex: "9" },
    },
    { id: "page-tertiary", type: "ul" },
    { id: "ribbon", type: "nav" },
    { id: "panels", type: "div", attributes: { class: "is-closed" } },
    { id: "panel-type", type: "div" },
    { id: "panel-jurisdiction", type: "div" },
    { id: "panel-year", type: "div" },
    { id: "panel-letter", type: "div" },
    { id: "page-content", type: "div" },
    { id: "page-main", type: "div" },
    { id: "page-side", type: "div" },
    { id: "Layer_1", type: "svg" },
  ],
  jurisdictions: [
    { code: "cth", name: "CTH", fullName: "Commonwealth" },
    { code: "act", name: "ACT", fullName: "Australian Capital Territory" },
    { code: "nsw", name: "NSW", fullName: "New South Wales" },
    { code: "nt", name: "NT", fullName: "Northern Territory" },
    { code: "qld", name: "QLD", fullName: "Queensland" },
    { code: "sa", name: "SA", fullName: "South Australia" },
    { code: "tas", name: "TAS", fullName: "Tasmania" },
    { code: "vic", name: "VIC", fullName: "Victoria" },
    { code: "wa", name: "WA", fullName: "Western Australia" },
  ],
  documentStructure: {
    title: "ROAD SAFETY ACT 1986 - SECT 116",
    act: "ROAD SAFETY ACT",
    year: 1986,
    jurisdiction: "VIC",
    section: "116",
    subsections: [
      { number: "1", content: "This section applies if—" },
      {
        number: "4",
        content:
          "In the case of an inspector who is a police officer and who is in uniform, before starting to inspect or search the vehicle he or she must, if requested to do so by the driver or person, state orally his or her name, rank and place of duty.",
      },
      {
        number: "5",
        content:
          "Despite subsection (2), it is not necessary for an inspector who is an authorised officer to identify himself or herself before starting to inspect or search the vehicle if—",
      },
      {
        number: "6",
        content:
          "If an inspector decides to start a search while in the process of conducting an inspection, it is not necessary for the inspector to comply with subsection (2), (3) or (4) again if the inspector starts the search during, or immediately after, the inspection.",
      },
    ],
    references: [
      { type: "section", text: "s. 116(4)", href: "/cgi-bin/viewdoc/au/legis/vic/consol_act/rsa1986125/s116.html" },
      { type: "section", text: "s. 23(1)", href: "/cgi-bin/viewdoc/au/legis/vic/consol_act/rsa1986125/s23.html" },
      { type: "section", text: "s. 10(Sch.", href: "/cgi-bin/viewdoc/au/legis/vic/consol_act/rsa1986125/s10.html" },
      { type: "section", text: "inspector", href: "s3.html#inspector" },
      { type: "section", text: "police officer", href: "s3.html#police_officer" },
      { type: "section", text: "vehicle", href: "s3.html#vehicle" },
      { type: "section", text: "driver", href: "s84c.html#driver" },
      { type: "section", text: "authorised officer", href: "s3.html#authorised_officer" },
      { type: "section", text: "highway", href: "s3.html#highway" },
      { type: "section", text: "heavy vehicles", href: "s3.html#heavy_vehicle" },
    ],
  },
}
