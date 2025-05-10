import { db, schema, connect, disconnect } from "../lib/db"
import { createId } from "@paralleldrive/cuid2"
import { addYears } from "date-fns"
import * as bcrypt from "bcryptjs"

async function seed() {
  try {
    console.log("🌱 Starting database seeding...")

    // Ensure connection is established
    await connect()

    // Clear existing data
    await db.delete(schema.users)

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const adminId = createId()

    console.log("👤 Creating admin user...")
    await db
      .insert(schema.users)
      .values({
        id: adminId,
        email: "admin@aulcaf.com",
        name: "Admin User",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing()

    // Create legal sources
    console.log("📚 Creating legal sources...")
    const privacyActId = createId()
    const securityActId = createId()
    const dataRetentionActId = createId()

    await db
      .insert(schema.legalSources)
      .values([
        {
          id: privacyActId,
          title: "Privacy Act 1988",
          description: "An Act to make provision to protect the privacy of individuals, and for related purposes",
          url: "https://www.legislation.gov.au/Details/C2021C00139",
          type: "Act",
          jurisdiction: "Federal",
          year: 1988,
          citation: "Privacy Act 1988 (Cth)",
        },
        {
          id: securityActId,
          title: "Security of Critical Infrastructure Act 2018",
          description: "An Act to provide a framework for managing risks relating to critical infrastructure",
          url: "https://www.legislation.gov.au/Details/C2021C00189",
          type: "Act",
          jurisdiction: "Federal",
          year: 2018,
          citation: "Security of Critical Infrastructure Act 2018 (Cth)",
        },
        {
          id: dataRetentionActId,
          title: "Telecommunications (Interception and Access) Amendment (Data Retention) Act 2015",
          description: "An Act to amend the law relating to telecommunications, and for other purposes",
          url: "https://www.legislation.gov.au/Details/C2015A00039",
          type: "Act",
          jurisdiction: "Federal",
          year: 2015,
          citation: "Telecommunications (Interception and Access) Amendment (Data Retention) Act 2015 (Cth)",
        },
      ])
      .onConflictDoNothing()

    // Create rules
    console.log("📋 Creating compliance rules...")
    const privacyRuleId = createId()
    const securityRuleId = createId()
    const dataRetentionRuleId = createId()

    await db
      .insert(schema.rules)
      .values([
        {
          id: privacyRuleId,
          title: "Personal Information Collection",
          description: "Requirements for collecting personal information under the Privacy Act",
          type: "privacy",
          content: `
# Personal Information Collection Rule

## Requirements
1. Only collect personal information that is reasonably necessary for your functions or activities
2. Obtain consent for collection of sensitive information
3. Notify individuals about the collection of their personal information

## Implementation
- Review all data collection points to ensure only necessary information is collected
- Implement consent mechanisms for sensitive information
- Provide clear privacy notices at all collection points
      `,
          isActive: true,
          priority: 1,
          createdById: adminId,
          updatedById: adminId,
        },
        {
          id: securityRuleId,
          title: "Data Security Measures",
          description: "Required security measures for protecting sensitive data",
          type: "security",
          content: `
# Data Security Measures Rule

## Requirements
1. Implement reasonable security safeguards to protect personal information
2. Regularly review and update security measures
3. Report eligible data breaches to affected individuals and the OAIC

## Implementation
- Encrypt sensitive data at rest and in transit
- Implement access controls and authentication mechanisms
- Establish a data breach response plan
- Conduct regular security assessments
      `,
          isActive: true,
          priority: 2,
          createdById: adminId,
          updatedById: adminId,
        },
        {
          id: dataRetentionRuleId,
          title: "Data Retention Periods",
          description: "Requirements for retaining and disposing of data",
          type: "data_retention",
          content: `
# Data Retention Periods Rule

## Requirements
1. Only retain personal information for as long as necessary
2. Securely destroy or de-identify information that is no longer needed
3. Comply with specific retention periods required by law

## Implementation
- Establish a data retention schedule
- Implement automated deletion or de-identification processes
- Document justifications for retention periods
- Regularly audit stored data
      `,
          isActive: true,
          priority: 3,
          createdById: adminId,
          updatedById: adminId,
        },
      ])
      .onConflictDoNothing()

    // Link rules to legal sources
    console.log("🔗 Linking rules to legal sources...")
    await db
      .insert(schema.ruleLegalSources)
      .values([
        {
          ruleId: privacyRuleId,
          legalSourceId: privacyActId,
        },
        {
          ruleId: securityRuleId,
          legalSourceId: securityActId,
        },
        {
          ruleId: dataRetentionRuleId,
          legalSourceId: dataRetentionActId,
        },
      ])
      .onConflictDoNothing()

    // Create rule versions
    console.log("📝 Creating rule versions...")
    await db
      .insert(schema.ruleVersions)
      .values([
        {
          ruleId: privacyRuleId,
          title: "Personal Information Collection",
          description: "Requirements for collecting personal information under the Privacy Act",
          type: "privacy",
          content: `
# Personal Information Collection Rule

## Requirements
1. Only collect personal information that is reasonably necessary for your functions or activities
2. Obtain consent for collection of sensitive information
3. Notify individuals about the collection of their personal information

## Implementation
- Review all data collection points to ensure only necessary information is collected
- Implement consent mechanisms for sensitive information
- Provide clear privacy notices at all collection points
      `,
          createdById: adminId,
          version: 1,
        },
        {
          ruleId: securityRuleId,
          title: "Data Security Measures",
          description: "Required security measures for protecting sensitive data",
          type: "security",
          content: `
# Data Security Measures Rule

## Requirements
1. Implement reasonable security safeguards to protect personal information
2. Regularly review and update security measures
3. Report eligible data breaches to affected individuals and the OAIC

## Implementation
- Encrypt sensitive data at rest and in transit
- Implement access controls and authentication mechanisms
- Establish a data breach response plan
- Conduct regular security assessments
      `,
          createdById: adminId,
          version: 1,
        },
        {
          ruleId: dataRetentionRuleId,
          title: "Data Retention Periods",
          description: "Requirements for retaining and disposing of data",
          type: "data_retention",
          content: `
# Data Retention Periods Rule

## Requirements
1. Only retain personal information for as long as necessary
2. Securely destroy or de-identify information that is no longer needed
3. Comply with specific retention periods required by law

## Implementation
- Establish a data retention schedule
- Implement automated deletion or de-identification processes
- Document justifications for retention periods
- Regularly audit stored data
      `,
          createdById: adminId,
          version: 1,
        },
      ])
      .onConflictDoNothing()

    // Create compliance checks
    console.log("✅ Creating compliance checks...")
    await db
      .insert(schema.complianceChecks)
      .values([
        {
          ruleId: privacyRuleId,
          status: "compliant",
          details: "All requirements met based on current implementation",
          checkedById: adminId,
          expiresAt: addYears(new Date(), 1),
        },
        {
          ruleId: securityRuleId,
          status: "warning",
          details: "Security measures in place but regular reviews need improvement",
          checkedById: adminId,
          expiresAt: addYears(new Date(), 1),
        },
        {
          ruleId: dataRetentionRuleId,
          status: "pending",
          details: "Initial assessment pending completion",
          checkedById: adminId,
          expiresAt: addYears(new Date(), 1),
        },
      ])
      .onConflictDoNothing()

    // Create settings
    console.log("⚙️ Creating system settings...")
    await db
      .insert(schema.settings)
      .values([
        {
          key: "system.name",
          value: "AU-Legis-Compliant Framework",
          category: "system",
          description: "The name of the compliance framework",
          updatedById: adminId,
        },
        {
          key: "notifications.email",
          value: "notifications@aulcaf.com",
          category: "notifications",
          description: "Email address used for sending notifications",
          updatedById: adminId,
        },
        {
          key: "compliance.check.frequency",
          value: "90",
          category: "compliance",
          description: "Number of days between compliance checks",
          updatedById: adminId,
        },
        {
          key: "audit.retention.days",
          value: "365",
          category: "audit",
          description: "Number of days to retain audit logs",
          updatedById: adminId,
        },
      ])
      .onConflictDoNothing()

    // Create API key
    console.log("🔑 Creating API key...")
    await db
      .insert(schema.apiKeys)
      .values({
        name: "Default API Key",
        key: `aulcaf_${createId()}`,
        createdById: adminId,
        expiresAt: addYears(new Date(), 1),
      })
      .onConflictDoNothing()

    // Create initial audit log
    console.log("📜 Creating initial audit log...")
    await db
      .insert(schema.auditLogs)
      .values({
        action: "system.initialized",
        entityType: "system",
        details: { message: "System initialized with seed data" },
        severity: "info",
        userId: adminId,
      })
      .onConflictDoNothing()

    console.log("✅ Database seeding completed successfully!")
    console.log("Seeding completed successfully")
  } catch (error) {
    console.error("Seeding failed:", error)
    process.exit(1)
  } finally {
    // Close the connection
    await disconnect()
    process.exit(0)
  }
}

// Run the seed function
seed()
  .catch((error) => {
    console.error("Error seeding database:", error)
    process.exit(1)
  })
  .finally(async () => {
    // Close the database connection
    // await disconnect();
    // process.exit(0)
  })
