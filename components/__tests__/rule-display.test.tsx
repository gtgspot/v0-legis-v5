import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { format } from "date-fns"
import { describe, expect, it, beforeEach, vi } from "vitest"

import { RuleDisplay } from "../rule-display"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const mockGetRuleHistory = vi.fn()

vi.mock("@/app/actions/rules", () => ({
  getRuleHistory: (...args: unknown[]) => mockGetRuleHistory(...args),
}))

type RuleProps = Parameters<typeof RuleDisplay>[0]["rule"]

const createRule = (overrides?: Partial<RuleProps>): RuleProps => ({
  id: "RULE-1",
  title: "Sample Rule",
  source: "Test Source",
  condition: "if data is collected",
  requirement: "obtain explicit consent",
  consequence: "breach notification required",
  enforcement: "Possible fine",
  category: "privacy",
  status: "active",
  ...overrides,
})

describe("RuleDisplay rule history", () => {
  beforeEach(() => {
    mockGetRuleHistory.mockReset()
  })

  it("fetches and displays rule history when toggled open", async () => {
    const user = userEvent.setup()
    const history = [
      {
        id: "history-1",
        changeSummary: "Updated requirement to include consent form reference",
        createdAt: "2024-01-01T12:00:00.000Z",
        user: { name: "Alex Smith" },
      },
    ]

    mockGetRuleHistory.mockResolvedValueOnce({ success: true, history })

    render(<RuleDisplay rule={createRule()} />)

    await user.click(screen.getByRole("button", { name: /expand rule details/i }))
    await user.click(screen.getByRole("button", { name: /show rule history/i }))

    expect(mockGetRuleHistory).toHaveBeenCalledWith("RULE-1")

    const formattedTimestamp = format(new Date(history[0].createdAt), "PPpp")

    expect(await screen.findByText(history[0].changeSummary)).toBeInTheDocument()
    expect(screen.getByText(`By: ${history[0].user.name}`)).toBeInTheDocument()
    expect(screen.getByText(formattedTimestamp)).toBeInTheDocument()
  })

  it("reloads history when the rule changes while history is visible", async () => {
    const user = userEvent.setup()
    const initialHistory = [
      {
        id: "history-initial",
        changeSummary: "Initial summary",
        createdAt: "2024-01-02T09:00:00.000Z",
        user: { name: "Morgan" },
      },
    ]

    const updatedHistory = [
      {
        id: "history-updated",
        changeSummary: "Updated rule summary",
        createdAt: "2024-02-10T15:30:00.000Z",
        user: { name: "Jamie" },
      },
    ]

    mockGetRuleHistory.mockResolvedValueOnce({ success: true, history: initialHistory })

    const { rerender } = render(<RuleDisplay rule={createRule()} />)

    await user.click(screen.getByRole("button", { name: /expand rule details/i }))
    await user.click(screen.getByRole("button", { name: /show rule history/i }))
    expect(await screen.findByText(initialHistory[0].changeSummary)).toBeInTheDocument()

    mockGetRuleHistory.mockResolvedValueOnce({ success: true, history: updatedHistory })

    const nextRule = createRule({ id: "RULE-2", title: "Updated Rule" })
    rerender(<RuleDisplay rule={nextRule} />)

    expect(await screen.findByText(updatedHistory[0].changeSummary)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(initialHistory[0].changeSummary)).not.toBeInTheDocument())
    expect(mockGetRuleHistory).toHaveBeenLastCalledWith("RULE-2")
  })

  it("shows an empty state when no history is returned", async () => {
    const user = userEvent.setup()

    mockGetRuleHistory.mockResolvedValueOnce({ success: true, history: [] })

    render(<RuleDisplay rule={createRule()} />)

    await user.click(screen.getByRole("button", { name: /expand rule details/i }))
    await user.click(screen.getByRole("button", { name: /show rule history/i }))

    expect(await screen.findByText(/No history available for this rule\./i)).toBeInTheDocument()
  })
})
