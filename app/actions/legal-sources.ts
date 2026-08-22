"use server"

import { caseLawData } from "@/lib/api"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import * as schema from "@/lib/schema"
import { and, eq, ilike, or } from "drizzle-orm"
import { randomUUID } from "node:crypto"

export type LegalSearchFilters = {
  jurisdictions: string[]
  types: string[]
  years: number[]
  relevance: string[]
  sources: string[]
}

export type LegalSearchResult = {
  id: string
  title: string
  citation?: string | null
  section?: string | null
  year?: number
  court?: string | null
  type: string
  summary: string
  relevance: "High" | "Medium" | "Low"
  source: string
  url?: string | null
  jurisdiction: string
  tags?: string[]
  dateAccessed: string
  relatedRuleIds?: string[]
}

export type LegalSearchResponse = {
  results: LegalSearchResult[]
  allResults: LegalSearchResult[]
  metadata: {
    availableFilters: LegalSearchFilters
    counts: {
      total: number
      database: number
      caseFeed: number
      rules: number
    }
  }
}

type DbLegalSource = Awaited<ReturnType<typeof db.query.legalSources.findMany>>[number]
type DbRule = Awaited<ReturnType<typeof db.query.rules.findMany>>[number]

const DEFAULT_SUMMARY = "Summary not available."

function computeMatchScore(texts: Array<string | null | undefined>, term: string) {
  const normalizedTerm = term.toLowerCase().trim()

  if (!normalizedTerm) {
    return 0
  }

  const tokens = normalizedTerm.split(/\s+/).filter(Boolean)

  return texts.reduce((score, text) => {
    if (!text) return score

    const normalizedText = text.toLowerCase()

    let updatedScore = score

    if (normalizedText.includes(normalizedTerm)) {
      updatedScore += 3
    }

    for (const token of tokens) {
      if (normalizedText.includes(token)) {
        updatedScore += 2
      }
    }

    return updatedScore
  }, 0)
}

function determineRelevance(score: number): "High" | "Medium" | "Low" {
  if (score >= 8) return "High"
  if (score >= 4) return "Medium"
  return "Low"
}

function mapLegalSourceType(type: string | null | undefined): string {
  if (!type) return "legislation"

  const normalized = type.toLowerCase()

  if (normalized.includes("regulation") || normalized.includes("code")) {
    return "regulation"
  }

  if (normalized.includes("guidance") || normalized.includes("guideline")) {
    return "guidance"
  }

  if (normalized.includes("policy") || normalized.includes("rule")) {
    return "rule"
  }

  return "legislation"
}

function mapDbLegalSource(source: DbLegalSource, term: string): LegalSearchResult {
  const relatedRules = source.rules?.map((rule) => rule.ruleId).filter(Boolean) ?? []

  const summary = source.description ?? DEFAULT_SUMMARY
  const score = computeMatchScore([source.title, source.description, source.citation], term)

  return {
    id: source.id,
    title: source.title,
    citation: source.citation,
    year: source.year ?? undefined,
    type: mapLegalSourceType(source.type),
    summary,
    relevance: determineRelevance(score),
    source: "AULCAF Database",
    url: source.url,
    jurisdiction: source.jurisdiction ?? "Unknown",
    tags: [source.type].filter(Boolean) as string[],
    dateAccessed: new Date().toISOString().split("T")[0],
    relatedRuleIds: relatedRules,
  }
}

function extractYear(value: unknown): number | undefined {
  if (!value) return undefined

  const date = value instanceof Date ? value : new Date(value as any)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.getFullYear()
}

function mapRule(rule: DbRule, term: string): LegalSearchResult {
  const relatedJurisdictions = rule.legalSources
    ?.map((entry) => entry.legalSource?.jurisdiction)
    .filter(Boolean) as string[]

  const jurisdiction = relatedJurisdictions?.[0] ?? "Internal"

  const score = computeMatchScore([rule.title, rule.description, rule.content], term)

  const summary = rule.description
    ? rule.description
    : rule.content
        ?.replace(/[#*_>`]/g, " ")
        .split(/\s+/)
        .slice(0, 50)
        .join(" ") ?? DEFAULT_SUMMARY

  return {
    id: `rule-${rule.id}`,
    title: rule.title,
    type: "rule",
    summary,
    relevance: determineRelevance(score),
    source: "Compliance Rules",
    jurisdiction,
    year: extractYear(rule.updatedAt) ?? extractYear(rule.createdAt),
    tags: [rule.type].filter(Boolean) as string[],
    dateAccessed: new Date().toISOString().split("T")[0],
    relatedRuleIds: [rule.id],
  }
}

type ExternalCase = {
  id: string
  title: string
  citation?: string
  snippet?: string
  url?: string
  court?: string
  jurisdiction?: string
  decisionDate?: string
}

function mapExternalCase(item: ExternalCase, term: string): LegalSearchResult {
  const score = computeMatchScore([item.title, item.citation, item.snippet], term)

  const year = item.decisionDate ? Number.parseInt(item.decisionDate.slice(0, 4), 10) : undefined

  return {
    id: item.id,
    title: item.title,
    citation: item.citation,
    year: Number.isFinite(year) ? year : undefined,
    court: item.court,
    type: "case",
    summary: item.snippet ?? DEFAULT_SUMMARY,
    relevance: determineRelevance(score),
    source: "Case Law Feed",
    url: item.url,
    jurisdiction: item.jurisdiction ?? item.court ?? "Unknown",
    tags: [item.court, item.jurisdiction].filter(Boolean) as string[],
    dateAccessed: new Date().toISOString().split("T")[0],
  }
}

async function fetchExternalCases(term: string) {
  if (!term.trim()) {
    return [] as LegalSearchResult[]
  }

  try {
    const url = new URL("https://www.courtlistener.com/api/rest/v3/search/")
    url.searchParams.set("type", "o")
    url.searchParams.set("order_by", "score desc")
    url.searchParams.set("q", term)
    url.searchParams.set("page_size", "5")

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch external case feed: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data?.results)) {
      throw new Error("Unexpected response structure from external case feed")
    }

    return data.results
      .map((item: any) =>
        mapExternalCase(
          {
            id: `case-feed-${item.id ?? item.absolute_url ?? randomUUID()}`,
            title: item.caseName ?? item.case_name ?? item.title ?? "Case law result",
            citation:
              item.citation ||
              item.citation_string ||
              (Array.isArray(item.citations) ? item.citations[0]?.cite : undefined),
            snippet:
              item.snippet ||
              item.summary ||
              item.short_summary ||
              item.head_matter ||
              item.html &&
                typeof item.html === "string"
                ? item.html.replace(/<[^>]+>/g, " ").slice(0, 280)
                : undefined,
            url: item.absolute_url ?? item.resource_uri ?? undefined,
            court:
              item.court?.name ||
              item.court?.name_abbreviation ||
              item.court ||
              item.jurisdiction,
            jurisdiction:
              item.jurisdiction ||
              item.court?.jurisdiction ||
              item.court?.name ||
              undefined,
            decisionDate: item.dateFiled ?? item.date_filed ?? item.decision_date,
          },
          term,
        ),
      )
      .filter((item) => Boolean(item.title))
  } catch (error) {
    console.warn("Falling back to local case law data due to external feed error", error)

    const lowerTerm = term.toLowerCase()

    return caseLawData
      .filter((item) => {
        if (!lowerTerm) return true

        return (
          item.title.toLowerCase().includes(lowerTerm) ||
          item.summary.toLowerCase().includes(lowerTerm) ||
          item.keywords.some((keyword) => keyword.toLowerCase().includes(lowerTerm))
        )
      })
      .slice(0, 5)
      .map((item) =>
        mapExternalCase(
          {
            id: item.id,
            title: item.title,
            citation: item.citation,
            snippet: item.summary,
            url: undefined,
            court: item.court,
            jurisdiction: item.court,
            decisionDate: item.year ? `${item.year}-01-01` : undefined,
          },
          term,
        ),
      )
  }
}

function buildAvailableFilters(results: LegalSearchResult[]): LegalSearchFilters {
  const jurisdictions = new Set<string>()
  const types = new Set<string>()
  const years = new Set<number>()
  const relevance = new Set<"High" | "Medium" | "Low">()
  const sources = new Set<string>()

  for (const result of results) {
    if (result.jurisdiction) {
      jurisdictions.add(result.jurisdiction)
    }

    if (result.type) {
      types.add(result.type)
    }

    if (typeof result.year === "number") {
      years.add(result.year)
    }

    if (result.relevance) {
      relevance.add(result.relevance)
    }

    if (result.source) {
      sources.add(result.source)
    }
  }

  const relevanceOrder: Array<"High" | "Medium" | "Low"> = ["High", "Medium", "Low"]

  return {
    jurisdictions: Array.from(jurisdictions).sort((a, b) => a.localeCompare(b)),
    types: Array.from(types).sort((a, b) => a.localeCompare(b)),
    years: Array.from(years).sort((a, b) => b - a),
    relevance: relevanceOrder.filter((level) => relevance.has(level)),
    sources: Array.from(sources).sort((a, b) => a.localeCompare(b)),
  }
}

function applyFilters(results: LegalSearchResult[], filters: Partial<LegalSearchFilters> | undefined) {
  if (!filters) return results

  return results.filter((result) => {
    if (filters.jurisdictions && filters.jurisdictions.length > 0 && !filters.jurisdictions.includes(result.jurisdiction)) {
      return false
    }

    if (filters.types && filters.types.length > 0 && !filters.types.includes(result.type)) {
      return false
    }

    if (filters.years && filters.years.length > 0 && (!result.year || !filters.years.includes(result.year))) {
      return false
    }

    if (filters.relevance && filters.relevance.length > 0 && !filters.relevance.includes(result.relevance)) {
      return false
    }

    if (filters.sources && filters.sources.length > 0 && !filters.sources.includes(result.source)) {
      return false
    }

    return true
  })
}

export async function searchLegalSources({
  term,
  filters,
}: {
  term: string
  filters?: Partial<LegalSearchFilters>
}): Promise<LegalSearchResponse> {
  const currentUser = await getCurrentUser()
  const canReadRules = Boolean(currentUser && ["admin", "editor", "viewer"].includes(currentUser.role))

  const query = term.trim()

  if (!query) {
    return {
      results: [],
      allResults: [],
      metadata: {
        availableFilters: {
          jurisdictions: [],
          types: [],
          years: [],
          relevance: [],
          sources: [],
        },
        counts: { total: 0, database: 0, caseFeed: 0, rules: 0 },
      },
    }
  }

  const legalSourcesPromise = db.query.legalSources.findMany({
    where: or(
      ilike(schema.legalSources.title, `%${query}%`),
      ilike(schema.legalSources.description, `%${query}%`),
      ilike(schema.legalSources.citation, `%${query}%`),
    ),
    with: {
      rules: true,
    },
    limit: 25,
  })

  const rulesPromise: Promise<DbRule[]> = canReadRules
    ? db.query.rules.findMany({
        where: and(
          eq(schema.rules.isActive, true),
          or(
            ilike(schema.rules.title, `%${query}%`),
            ilike(schema.rules.description, `%${query}%`),
            ilike(schema.rules.content, `%${query}%`),
          ),
        ),
        with: {
          legalSources: {
            with: {
              legalSource: true,
            },
          },
        },
        limit: 15,
      })
    : Promise.resolve([])

  const [legalSources, rules, externalCases] = await Promise.all([
    legalSourcesPromise,
    rulesPromise,
    fetchExternalCases(query),
  ])

  const dbResults = legalSources.map((source) => mapDbLegalSource(source, query))
  const ruleResults = rules.map((rule) => mapRule(rule, query))

  const combined = [...dbResults, ...ruleResults, ...externalCases]

  // Deduplicate by ID to prevent collisions between feeds
  const dedupedMap = new Map<string, LegalSearchResult>()

  for (const result of combined) {
    dedupedMap.set(result.id, result)
  }

  const dedupedResults = Array.from(dedupedMap.values())

  const metadata = {
    availableFilters: buildAvailableFilters(dedupedResults),
    counts: {
      total: dedupedResults.length,
      database: dbResults.length,
      caseFeed: externalCases.length,
      rules: ruleResults.length,
    },
  }

  const filteredResults = applyFilters(dedupedResults, filters)

  return {
    results: filteredResults,
    allResults: dedupedResults,
    metadata,
  }
}
