// Simulated API endpoints for the framework data

// Framework data structure
export const frameworkData = {
  id: "AULCAF-v1",
  title: "AU-Legis-Compliant AI Framework",
  description:
    "A modular AI governance framework that complies with Australian non-AI-specific statutes while allowing limitless, scalable infrastructure.",
  jurisdiction: "Australia",
  version: "1.0",
  effective_date: "2025-04-20",

  rules: [
    {
      id: "PRIV-01",
      title: "Data Must Be Handled Lawfully",
      source: "Privacy Act 1988 (Cth)",
      condition: "data.contains_personal_information == true",
      requirement: "data.has_consent == true",
      consequence: "Block processing and alert user if no valid consent",
      enforcement: "OAIC audit-compliant logging must be enabled",
      category: "privacy",
      status: "active",
    },
    {
      id: "PRIV-02",
      title: "De-identification of Personal Data",
      source: "Privacy Act 1988 (Cth)",
      condition: 'data.handling_type == "analysis"',
      requirement: "data.must_be_deidentified == true",
      consequence: "Strip identifiable fields or flag for compliance override",
      category: "privacy",
      status: "active",
    },
    {
      id: "CONSUMER-01",
      title: "No Misleading Outputs",
      source: "Australian Consumer Law (ACL)",
      condition: "ai_output.statement.is_public == true",
      requirement: "ai_output.statement.is_verified == true",
      consequence: "Flag output and withhold display if unverifiable",
      category: "consumer",
      status: "active",
    },
    {
      id: "CRIM-01",
      title: "Prevent Unauthorised Access",
      source: "Criminal Code Act 1995 (Cth)",
      condition: 'ai_action.type == "automated_access"',
      requirement: 'ai_action.access_method in ["token", "authHeader", "oauth"]',
      consequence: "Abort unauthorized action and notify compliance officer",
      category: "security",
      status: "active",
    },
    {
      id: "WHS-01",
      title: "Safety Protocols for AI in Workplaces",
      source: "Work Health and Safety Act 2011 (Cth)",
      condition: 'ai_context.environment == "workplace"',
      requirement: "ai_system.safety_audit_passed == true",
      consequence: "System must not operate without audit pass",
      category: "safety",
      status: "active",
    },
  ],

  infrastructure: {
    scaling: {
      model: "serverless|microservices",
      requirement: "features_can_expand_if_compliant == true",
      limit: "none",
      dynamic_permissions: true,
    },
  },

  compliance_checks: {
    frequency: "on-deploy|hourly|on-critical-change",
    logging: "encrypted_and_timestamped",
    auditing: "immutable_logs, role_based_access",
    escalation_path: ["Compliance Officer", "CTO", "Legal Team", "Regulatory Body"],
  },
}

// Case law data
export const caseLawData = [
  {
    id: "case-001",
    title: "Privacy Commissioner v Telstra Corporation Limited",
    citation: "[2017] FCAFC 4",
    year: 2017,
    court: "Federal Court of Australia",
    summary:
      "This case established that 'personal information' under the Privacy Act must be information 'about an individual'. Technical data that merely relates to an individual but is not about them may not be covered.",
    relevantRules: ["PRIV-01", "PRIV-02"],
    keywords: ["privacy", "personal information", "data", "telstra"],
  },
  {
    id: "case-002",
    title: "Australian Competition and Consumer Commission v Google LLC",
    citation: "[2021] FCA 971",
    year: 2021,
    court: "Federal Court of Australia",
    summary:
      "Google was found to have misled consumers about the collection and use of personal location data on Android devices, violating Australian Consumer Law. This case highlights the importance of clear disclosure about data collection practices.",
    relevantRules: ["CONSUMER-01", "PRIV-01"],
    keywords: ["consumer", "misleading", "data collection", "google", "location data"],
  },
  {
    id: "case-003",
    title: "Director of Consumer Affairs Victoria v Scully (No 3)",
    citation: "[2013] VSCA 292",
    year: 2013,
    court: "Supreme Court of Victoria",
    summary:
      "This case established that misleading conduct can occur even without an intention to mislead. Automated systems that produce misleading outputs can still violate consumer law regardless of intent.",
    relevantRules: ["CONSUMER-01"],
    keywords: ["consumer", "misleading", "automated systems", "intent"],
  },
  {
    id: "case-004",
    title: "DPP v Murdoch",
    citation: "[2007] VSCA 272",
    year: 2007,
    court: "Supreme Court of Victoria",
    summary:
      "This case dealt with unauthorized access to computer systems and established that accessing systems without proper authorization is a criminal offense, even if security measures are minimal.",
    relevantRules: ["CRIM-01"],
    keywords: ["unauthorized access", "security", "criminal", "computer systems"],
  },
  {
    id: "case-005",
    title: "Comcare v Banerji",
    citation: "[2019] HCA 23",
    year: 2019,
    court: "High Court of Australia",
    summary:
      "While primarily about free speech, this case has implications for workplace policies and safety. It established that reasonable workplace policies can be enforced even when they limit certain rights.",
    relevantRules: ["WHS-01"],
    keywords: ["workplace", "safety", "policies", "enforcement"],
  },
  {
    id: "case-006",
    title: "N v Australian Information Commissioner",
    citation: "[2021] FCA 525",
    year: 2021,
    court: "Federal Court of Australia",
    summary:
      "This case addressed the de-identification of personal information and established that proper de-identification must make re-identification reasonably unlikely in the context of the data release.",
    relevantRules: ["PRIV-02"],
    keywords: ["privacy", "de-identification", "data analysis", "re-identification"],
  },
  {
    id: "case-007",
    title: "Australian Competition and Consumer Commission v Trivago N.V.",
    citation: "[2020] FCA 16",
    year: 2020,
    court: "Federal Court of Australia",
    summary:
      "Trivago's algorithm was found to mislead consumers by presenting hotel deals that weren't the cheapest available. This case highlights that algorithmic outputs can be misleading under consumer law.",
    relevantRules: ["CONSUMER-01"],
    keywords: ["consumer", "algorithm", "misleading", "automated decision"],
  },
]

// Simulate API fetch delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// API functions
export async function fetchFrameworkData() {
  await delay(800) // Simulate network delay
  return frameworkData
}

export async function fetchCaseLaw(searchTerm = "") {
  await delay(600) // Simulate network delay

  if (!searchTerm) return caseLawData

  const lowerSearchTerm = searchTerm.toLowerCase()
  return caseLawData.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(lowerSearchTerm) ||
      caseItem.summary.toLowerCase().includes(lowerSearchTerm) ||
      caseItem.keywords.some((keyword) => keyword.toLowerCase().includes(lowerSearchTerm)) ||
      caseItem.relevantRules.some((rule) => rule.toLowerCase().includes(lowerSearchTerm)),
  )
}

export async function fetchCaseLawByRule(ruleId: string) {
  await delay(500) // Simulate network delay
  return caseLawData.filter((caseItem) => caseItem.relevantRules.includes(ruleId))
}

// Real-time updates (simulated)
export async function subscribeToFrameworkUpdates(callback: (data: any) => void) {
  // In a real implementation, this would use WebSockets or Server-Sent Events
  // For this demo, we'll just simulate periodic updates
  const interval = setInterval(async () => {
    const data = await fetchFrameworkData()
    callback(data)
  }, 30000) // Check for updates every 30 seconds

  return () => clearInterval(interval) // Return cleanup function
}
