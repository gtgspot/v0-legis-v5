"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Shield, CheckCircle, AlertTriangle, FileText, EyeOff } from "lucide-react"

export function ZeroKnowledgeProofs() {
  const [activeTab, setActiveTab] = useState("overview")
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle")

  const handleVerify = () => {
    setVerificationStatus("verifying")
    setTimeout(() => {
      setVerificationStatus("success")
    }, 2000)
  }

  return (
    <Card className="border-purple-100">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-purple-800">Zero-Knowledge Compliance Proofs</CardTitle>
          <Lock className="h-6 w-6 text-purple-600" />
        </div>
        <CardDescription>Verify compliance without exposing sensitive data</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-t-none bg-gray-100 p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="verification"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Verification
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Use Cases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2">What are Zero-Knowledge Proofs?</h3>
                <p className="text-purple-700 mb-3">
                  Zero-knowledge proofs allow one party (the prover) to prove to another party (the verifier) that a
                  statement is true, without revealing any information beyond the validity of the statement itself.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-purple-100 flex flex-col items-center text-center">
                    <div className="bg-purple-100 p-2 rounded-full mb-2">
                      <Lock className="h-5 w-5 text-purple-700" />
                    </div>
                    <h4 className="font-medium text-purple-800 mb-1">Privacy</h4>
                    <p className="text-purple-600">No sensitive data is ever exposed</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-100 flex flex-col items-center text-center">
                    <div className="bg-purple-100 p-2 rounded-full mb-2">
                      <CheckCircle className="h-5 w-5 text-purple-700" />
                    </div>
                    <h4 className="font-medium text-purple-800 mb-1">Verification</h4>
                    <p className="text-purple-600">Compliance can be mathematically proven</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-100 flex flex-col items-center text-center">
                    <div className="bg-purple-100 p-2 rounded-full mb-2">
                      <Shield className="h-5 w-5 text-purple-700" />
                    </div>
                    <h4 className="font-medium text-purple-800 mb-1">Compliance</h4>
                    <p className="text-purple-600">Meets Australian privacy requirements</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-purple-600" />
                    How It Works
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      Our zero-knowledge proof system uses zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments
                      of Knowledge) to verify compliance with Australian regulations without exposing the underlying
                      data.
                    </p>
                    <p>
                      For example, an organization can prove they have obtained proper consent for data processing
                      without revealing the actual consent records or personal information.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-emerald-600" />
                    Legal Compliance
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Privacy Act 1988:</span> Enables compliance verification without
                        data exposure
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Australian Privacy Principles:</span> Supports data minimization
                        requirements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Regulatory Audits:</span> Provides verifiable proof for compliance
                        audits
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="p-6">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-4">Compliance Verification Demo</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <EyeOff className="h-4 w-4 mr-1 text-purple-600" />
                        Private Data (Not Shared)
                      </h4>
                      <div className="bg-white p-2 rounded border border-gray-200 font-mono text-xs text-gray-600 overflow-x-auto">
                        {`{
  "user_ids": ["a8f2c1", "b7d3e9", "c6f4g2", ...],
  "consent_records": {
    "a8f2c1": { "timestamp": "2025-01-15T09:23:11Z", "type": "explicit" },
    "b7d3e9": { "timestamp": "2025-02-03T14:17:22Z", "type": "explicit" },
    "c6f4g2": { "timestamp": "2025-01-29T11:05:47Z", "type": "explicit" },
    ...
  },
  "data_purpose": "marketing_analytics",
  "retention_period": "24_months"
}`}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Lock className="h-4 w-4 mr-1 text-purple-600" />
                        Zero-Knowledge Proof (Shared)
                      </h4>
                      <div className="bg-white p-2 rounded border border-gray-200 font-mono text-xs text-gray-600 overflow-x-auto">
                        {`{
  "proof": {
    "pi_a": ["14897277826845827", "19788598575768542", "1"],
    "pi_b": [
      ["16374391127223064", "20192309963945711"],
      ["7583099ᵉ⁺⁰⁹", "21031901ᵉ⁺⁰⁸"],
      ["1", "0"]
    ],
    "pi_c": ["11953278682803212", "15787614492403216", "1"],
    "protocol": "groth16"
  },
  "public_inputs": {
    "data_purpose_hash": "0x7a2f1d8b9c3e4f5a",
    "consent_merkle_root": "0x3e4f5a6b7c8d9e0f",
    "compliance_timestamp": "2025-04-22T14:30:00Z"
  }
}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-purple-600" />
                        Compliance Statement
                      </h4>
                      <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700">
                        <p className="mb-2">
                          <strong>Claim:</strong> All data processing for marketing analytics has valid explicit consent
                          from users, in compliance with APP 3 and APP 6.
                        </p>
                        <p>
                          <strong>Verification:</strong> The zero-knowledge proof cryptographically verifies this claim
                          without revealing any user identities or consent records.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-grow flex flex-col items-center justify-center">
                      <div className="text-center mb-4">
                        {verificationStatus === "idle" && (
                          <div className="bg-gray-100 rounded-full p-4 inline-block mb-2">
                            <Lock className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        {verificationStatus === "verifying" && (
                          <div className="bg-blue-100 rounded-full p-4 inline-block mb-2">
                            <svg
                              className="animate-spin h-8 w-8 text-blue-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        )}
                        {verificationStatus === "success" && (
                          <div className="bg-green-100 rounded-full p-4 inline-block mb-2">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                        )}
                        {verificationStatus === "failed" && (
                          <div className="bg-red-100 rounded-full p-4 inline-block mb-2">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                          </div>
                        )}

                        <h3 className="font-medium text-lg">
                          {verificationStatus === "idle" && "Ready to Verify"}
                          {verificationStatus === "verifying" && "Verifying Proof..."}
                          {verificationStatus === "success" && "Verification Successful"}
                          {verificationStatus === "failed" && "Verification Failed"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {verificationStatus === "idle" && "Click verify to check compliance without exposing data"}
                          {verificationStatus === "verifying" && "Checking cryptographic proof validity..."}
                          {verificationStatus === "success" && "Compliance with Privacy Act 1988 verified"}
                          {verificationStatus === "failed" && "Proof does not match compliance requirements"}
                        </p>
                      </div>

                      <Button
                        onClick={handleVerify}
                        disabled={verificationStatus === "verifying"}
                        className={
                          verificationStatus === "success"
                            ? "bg-green-600 hover:bg-green-700"
                            : verificationStatus === "failed"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-purple-600 hover:bg-purple-700"
                        }
                      >
                        {verificationStatus === "idle" && "Verify Compliance"}
                        {verificationStatus === "verifying" && "Verifying..."}
                        {verificationStatus === "success" && "Verified ✓"}
                        {verificationStatus === "failed" && "Try Again"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-purple-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">Consent Verification</CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">PRIV-01</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-gray-700">
                        Prove that all personal data being processed has valid consent without revealing the actual
                        consent records or user identities.
                      </p>
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                        <h4 className="font-medium text-purple-800 mb-1">Benefits</h4>
                        <ul className="list-disc pl-5 text-purple-700 space-y-1">
                          <li>Compliance with APP 3 and APP 6</li>
                          <li>Protects sensitive user information</li>
                          <li>Enables third-party verification</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">De-identification Proof</CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">PRIV-02</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-gray-700">
                        Verify that data has been properly de-identified according to Privacy Act standards without
                        exposing the de-identification methods or original data.
                      </p>
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                        <h4 className="font-medium text-purple-800 mb-1">Benefits</h4>
                        <ul className="list-disc pl-5 text-purple-700 space-y-1">
                          <li>Ensures proper anonymization</li>
                          <li>Protects de-identification techniques</li>
                          <li>Enables safe data sharing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">Output Verification</CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">CONSUMER-01</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-gray-700">
                        Prove that AI outputs are verified and not misleading according to Australian Consumer Law
                        without revealing proprietary verification methods.
                      </p>
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                        <h4 className="font-medium text-purple-800 mb-1">Benefits</h4>
                        <ul className="list-disc pl-5 text-purple-700 space-y-1">
                          <li>Ensures ACL compliance</li>
                          <li>Protects verification algorithms</li>
                          <li>Builds consumer trust</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">Access Control Verification</CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">CRIM-01</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-gray-700">
                        Verify that all system access is properly authenticated without revealing the actual
                        authentication methods or credentials.
                      </p>
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                        <h4 className="font-medium text-purple-800 mb-1">Benefits</h4>
                        <ul className="list-disc pl-5 text-purple-700 space-y-1">
                          <li>Prevents unauthorized access</li>
                          <li>Protects security infrastructure</li>
                          <li>Enables third-party auditing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Legal Considerations</h3>
                    <p className="text-sm text-gray-700">
                      While zero-knowledge proofs provide strong privacy guarantees, organizations must still ensure
                      they have proper legal grounds for data processing. The proofs complement but do not replace other
                      compliance requirements under Australian law.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
