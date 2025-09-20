import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { LegalSearchResponse } from "@/app/actions/legal-sources"
import { LegalInformation } from "@/components/legal-information"
import { searchLegalSources } from "@/app/actions/legal-sources"
import { vi } from "vitest"

vi.mock("@/app/actions/legal-sources", () => ({
  searchLegalSources: vi.fn(),
}))

const mockedSearch = vi.mocked(searchLegalSources)

function createMockResponse(): LegalSearchResponse {
  return {
    results: [
      {
        id: "source-privacy-act",
        title: "Privacy Act 1988",
        summary: "Protects the privacy of individuals in Australia.",
        type: "legislation",
        relevance: "High",
        source: "AULCAF Database",
        jurisdiction: "Federal",
        year: 1988,
        dateAccessed: "2024-05-01",
        citation: "Privacy Act 1988 (Cth)",
        tags: ["privacy"],
      },
      {
        id: "case-privacy-telstra",
        title: "Privacy Commissioner v Telstra Corporation Limited",
        summary: "Clarifies how personal information is interpreted in telecommunications contexts.",
        type: "case",
        relevance: "Medium",
        source: "Case Law Feed",
        jurisdiction: "Federal",
        year: 2017,
        dateAccessed: "2024-05-01",
        court: "Federal Court of Australia",
        tags: ["privacy", "telstra"],
      },
    ],
    allResults: [
      {
        id: "source-privacy-act",
        title: "Privacy Act 1988",
        summary: "Protects the privacy of individuals in Australia.",
        type: "legislation",
        relevance: "High",
        source: "AULCAF Database",
        jurisdiction: "Federal",
        year: 1988,
        dateAccessed: "2024-05-01",
        citation: "Privacy Act 1988 (Cth)",
        tags: ["privacy"],
      },
      {
        id: "case-privacy-telstra",
        title: "Privacy Commissioner v Telstra Corporation Limited",
        summary: "Clarifies how personal information is interpreted in telecommunications contexts.",
        type: "case",
        relevance: "Medium",
        source: "Case Law Feed",
        jurisdiction: "Federal",
        year: 2017,
        dateAccessed: "2024-05-01",
        court: "Federal Court of Australia",
        tags: ["privacy", "telstra"],
      },
    ],
    metadata: {
      availableFilters: {
        jurisdictions: ["Federal"],
        types: ["case", "legislation"],
        years: [2017, 1988],
        relevance: ["High", "Medium"],
        sources: ["AULCAF Database", "Case Law Feed"],
      },
      counts: {
        total: 2,
        database: 1,
        caseFeed: 1,
        rules: 0,
      },
    },
  }
}

async function prepareSearch(user: ReturnType<typeof userEvent.setup>) {
  render(<LegalInformation />)
  await user.click(screen.getByRole("tab", { name: /legal search/i }))

  const input = screen.getByPlaceholderText(/search for legislation, cases, or legal concepts/i)
  await user.type(input, "privacy{enter}")

  await waitFor(() => expect(mockedSearch).toHaveBeenCalledTimes(1))
  await screen.findByText("Privacy Act 1988")
}

describe("LegalInformation search flow", () => {
  beforeEach(() => {
    mockedSearch.mockResolvedValue(createMockResponse())
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("performs a legal search and hydrates metadata", async () => {
    const user = userEvent.setup()

    await prepareSearch(user)

    expect(mockedSearch).toHaveBeenCalledWith({
      term: "privacy",
      filters: {
        jurisdictions: [],
        types: [],
        years: [],
        relevance: [],
        sources: [],
      },
    })

    expect(await screen.findByText("Privacy Act 1988")).toBeInTheDocument()

    await waitFor(() => {
      const history = JSON.parse(localStorage.getItem("legalSearchHistory") ?? "[]")
      expect(history).toEqual(["privacy"])
    })

    await user.click(screen.getByRole("button", { name: /filters/i }))
    expect(await screen.findByText("Case Law Feed")).toBeInTheDocument()
  })

  it("persists saved sources even after removal", async () => {
    const user = userEvent.setup()

    await prepareSearch(user)

    const resultTrigger = screen.getByRole("button", { name: /privacy act 1988/i })
    await user.click(resultTrigger)

    const saveButton = await screen.findByRole("button", { name: /^save$/i })
    await user.click(saveButton)

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("savedLegalSources") ?? "[]")
      expect(saved).toHaveLength(1)
      expect(saved[0].id).toBe("source-privacy-act")
    })

    await user.click(screen.getByRole("tab", { name: /saved sources/i }))
    expect(await screen.findByText("Privacy Act 1988")).toBeInTheDocument()

    const removeButtons = await screen.findAllByRole("button", { name: /remove/i })
    await user.click(removeButtons[0])

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("savedLegalSources") ?? "[]")
      expect(saved).toEqual([])
    })
  })
})
