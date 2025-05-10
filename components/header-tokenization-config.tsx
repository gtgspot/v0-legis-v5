"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, Trash, AlertTriangle, Code, Copy, Check } from "lucide-react"
import {
  type TokenizationStrategy,
  type HeaderTokenizationConfig,
  setHeaderTokenizationConfig,
  getHeaderTokenizationConfig,
  tokenizeHeader,
} from "@/lib/header-tokenization"

// Common HTTP headers for suggestions
const commonHeaders = [
  "Authorization",
  "Content-Type",
  "Accept",
  "Cookie",
  "User-Agent",
  "X-Requested-With",
  "X-Forwarded-For",
  "X-DataLex-Token",
  "X-AU-Compliance-Token",
  "X-AU-Jurisdiction",
  "X-AU-Legal-Reference",
]

export function HeaderTokenizationConfig() {
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedHeader, setSelectedHeader] = useState<string>("")
  const [newHeaderName, setNewHeaderName] = useState<string>("")
  const [config, setConfig] = useState<HeaderTokenizationConfig>({
    strategy: "simple",
    rules: {
      delimiter: ",",
      trimValues: true,
      ignoreEmpty: false,
    },
  })
  const [testHeaderValue, setTestHeaderValue] = useState<string>("")
  const [testResult, setTestResult] = useState<string[]>([])
  const [showTestResult, setShowTestResult] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  // Load saved headers on component mount
  useEffect(() => {
    const savedHeaders = localStorage.getItem("tokenizationHeaders")
    if (savedHeaders) {
      setHeaders(JSON.parse(savedHeaders))
    } else {
      // Default to some common headers if none are saved
      const defaultHeaders = ["Authorization", "Content-Type", "Accept"]
      setHeaders(defaultHeaders)
      localStorage.setItem("tokenizationHeaders", JSON.stringify(defaultHeaders))
    }
  }, [])

  // Load configuration when a header is selected
  useEffect(() => {
    if (selectedHeader) {
      const headerConfig = getHeaderTokenizationConfig(selectedHeader)
      setConfig(headerConfig)

      // Set a sample test value based on the header type
      if (selectedHeader.toLowerCase() === "authorization") {
        setTestHeaderValue("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0")
      } else if (selectedHeader.toLowerCase() === "content-type") {
        setTestHeaderValue("application/json; charset=utf-8")
      } else if (selectedHeader.toLowerCase() === "accept") {
        setTestHeaderValue("text/html, application/xhtml+xml, application/xml;q=0.9")
      } else if (selectedHeader.toLowerCase() === "cookie") {
        setTestHeaderValue("sessionId=abc123; userId=456; theme=dark")
      } else {
        setTestHeaderValue("")
      }

      setShowTestResult(false)
    }
  }, [selectedHeader])

  const handleAddHeader = () => {
    if (newHeaderName && !headers.includes(newHeaderName)) {
      const updatedHeaders = [...headers, newHeaderName]
      setHeaders(updatedHeaders)
      setSelectedHeader(newHeaderName)
      setNewHeaderName("")
      localStorage.setItem("tokenizationHeaders", JSON.stringify(updatedHeaders))
    }
  }

  const handleRemoveHeader = (header: string) => {
    const updatedHeaders = headers.filter((h) => h !== header)
    setHeaders(updatedHeaders)
    if (selectedHeader === header) {
      setSelectedHeader(updatedHeaders[0] || "")
    }
    localStorage.setItem("tokenizationHeaders", JSON.stringify(updatedHeaders))
  }

  const handleStrategyChange = (strategy: TokenizationStrategy) => {
    let updatedRules = { ...config.rules }

    // Set default rules based on strategy
    if (strategy === "simple") {
      updatedRules = {
        ...updatedRules,
        delimiter: ",",
        trimValues: true,
      }
    } else if (strategy === "csv") {
      updatedRules = {
        ...updatedRules,
        delimiter: ",",
        preserveQuotes: false,
        trimValues: true,
      }
    } else if (strategy === "jwt") {
      updatedRules = {
        ...updatedRules,
        delimiter: ".",
      }
    }

    setConfig({
      strategy,
      rules: updatedRules,
    })
  }

  const handleSaveConfig = () => {
    if (selectedHeader) {
      setHeaderTokenizationConfig(selectedHeader, config)

      // Show success message
      const notification = document.getElementById("save-notification")
      if (notification) {
        notification.classList.remove("opacity-0")
        notification.classList.add("opacity-100")
        setTimeout(() => {
          notification.classList.remove("opacity-100")
          notification.classList.add("opacity-0")
        }, 2000)
      }
    }
  }

  const handleTestTokenization = () => {
    if (selectedHeader && testHeaderValue) {
      const result = tokenizeHeader(selectedHeader, testHeaderValue)
      setTestResult(result)
      setShowTestResult(true)
    }
  }

  const handleCopyConfig = () => {
    const configJson = JSON.stringify(
      {
        header: selectedHeader,
        config: config,
      },
      null,
      2,
    )

    navigator.clipboard.writeText(configJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Header Tokenization Configuration</CardTitle>
        <CardDescription>Configure how HTTP headers are tokenized and processed in the framework</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Header Selection Sidebar */}
          <div className="md:col-span-1 border-r pr-4">
            <div className="space-y-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor="new-header">Add Header</Label>
                  <Input
                    id="new-header"
                    value={newHeaderName}
                    onChange={(e) => setNewHeaderName(e.target.value)}
                    placeholder="Enter header name"
                    list="header-suggestions"
                  />
                  <datalist id="header-suggestions">
                    {commonHeaders.map((header) => (
                      <option key={header} value={header} />
                    ))}
                  </datalist>
                </div>
                <Button onClick={handleAddHeader} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <Label>Configured Headers</Label>
                <div className="max-h-[400px] overflow-y-auto space-y-1 pr-2">
                  {headers.length > 0 ? (
                    headers.map((header) => (
                      <div
                        key={header}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                          selectedHeader === header ? "bg-emerald-50 border border-emerald-200" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedHeader(header)}
                      >
                        <span className="truncate">{header}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveHeader(header)
                          }}
                        >
                          <Trash className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">No headers configured yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Area */}
          <div className="md:col-span-3">
            {selectedHeader ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Configuring: {selectedHeader}</h3>
                    <p className="text-sm text-gray-500">Define how this header should be tokenized</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopyConfig}>
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? "Copied" : "Copy Config"}
                    </Button>
                    <Button onClick={handleSaveConfig} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="h-4 w-4 mr-1" />
                      Save Configuration
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList>
                    <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                    <TabsTrigger value="test">Test Tokenization</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tokenization-strategy">Tokenization Strategy</Label>
                        <Select
                          value={config.strategy}
                          onValueChange={(value) => handleStrategyChange(value as TokenizationStrategy)}
                        >
                          <SelectTrigger id="tokenization-strategy">
                            <SelectValue placeholder="Select strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simple Delimiter</SelectItem>
                            <SelectItem value="csv">CSV (with quote handling)</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="jwt">JWT</SelectItem>
                            <SelectItem value="custom">Custom Parser</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          {config.strategy === "simple" && "Splits the header value using a delimiter"}
                          {config.strategy === "csv" && "Handles CSV format with quoted values"}
                          {config.strategy === "json" && "Parses JSON data in the header"}
                          {config.strategy === "jwt" && "Splits JWT tokens by dots"}
                          {config.strategy === "custom" && "Uses a custom parsing function"}
                        </p>
                      </div>

                      {(config.strategy === "simple" || config.strategy === "csv") && (
                        <div className="space-y-2">
                          <Label htmlFor="delimiter">Delimiter</Label>
                          <Input
                            id="delimiter"
                            value={config.rules.delimiter || ""}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                rules: {
                                  ...config.rules,
                                  delimiter: e.target.value,
                                },
                              })
                            }
                            placeholder="e.g., , or ; or |"
                          />
                          <p className="text-xs text-gray-500">Character(s) used to split the header value</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="trim-values"
                          checked={config.rules.trimValues || false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              rules: {
                                ...config.rules,
                                trimValues: checked,
                              },
                            })
                          }
                        />
                        <Label htmlFor="trim-values">Trim Values</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ignore-empty"
                          checked={config.rules.ignoreEmpty || false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              rules: {
                                ...config.rules,
                                ignoreEmpty: checked,
                              },
                            })
                          }
                        />
                        <Label htmlFor="ignore-empty">Ignore Empty Values</Label>
                      </div>

                      {config.strategy === "csv" && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="preserve-quotes"
                            checked={config.rules.preserveQuotes || false}
                            onCheckedChange={(checked) =>
                              setConfig({
                                ...config,
                                rules: {
                                  ...config.rules,
                                  preserveQuotes: checked,
                                },
                              })
                            }
                          />
                          <Label htmlFor="preserve-quotes">Preserve Quotes</Label>
                        </div>
                      )}
                    </div>

                    {config.strategy === "simple" && (
                      <div className="space-y-2">
                        <Label htmlFor="key-value-separator">Key-Value Separator</Label>
                        <Input
                          id="key-value-separator"
                          value={config.rules.keyValueSeparator || ""}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              rules: {
                                ...config.rules,
                                keyValueSeparator: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g., = or :"
                        />
                        <p className="text-xs text-gray-500">
                          Character(s) used to separate keys and values (leave empty if not applicable)
                        </p>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-800">Configuration Tips</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            {selectedHeader.toLowerCase() === "authorization" &&
                              "For Authorization headers, use 'simple' strategy with space delimiter to separate the auth type (Bearer, Basic, etc.) from the token."}
                            {selectedHeader.toLowerCase() === "content-type" &&
                              "For Content-Type headers, use 'simple' strategy with semicolon delimiter to separate the MIME type from parameters like charset."}
                            {selectedHeader.toLowerCase() === "accept" &&
                              "For Accept headers, use 'csv' strategy to properly handle quality values (q=0.9) and multiple accepted types."}
                            {selectedHeader.toLowerCase() === "cookie" &&
                              "For Cookie headers, use 'simple' strategy with semicolon delimiter and equals sign as key-value separator."}
                            {!["authorization", "content-type", "accept", "cookie"].includes(
                              selectedHeader.toLowerCase(),
                            ) &&
                              "Choose a tokenization strategy based on the expected format of this header. Test with sample values to ensure correct parsing."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Maximum Tokens</Label>
                      <Input
                        id="max-tokens"
                        type="number"
                        value={config.rules.maxTokens || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            rules: {
                              ...config.rules,
                              maxTokens: e.target.value ? Number.parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        placeholder="Leave empty for unlimited"
                      />
                      <p className="text-xs text-gray-500">
                        Maximum number of tokens to extract (leave empty for unlimited)
                      </p>
                    </div>

                    {config.strategy === "custom" && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-parser">Custom Parser Function</Label>
                        <div className="relative">
                          <div className="absolute top-2 right-2">
                            <Badge variant="outline" className="bg-gray-100">
                              <Code className="h-3 w-3 mr-1" />
                              JavaScript
                            </Badge>
                          </div>
                          <textarea
                            id="custom-parser"
                            className="w-full h-40 font-mono text-sm p-3 border rounded-md"
                            placeholder="(value) => { 
  // Your custom parsing logic here
  return value.split(','); 
}"
                            onChange={(e) => {
                              try {
                                // This is just for validation, we'll store as string
                                // eslint-disable-next-line no-new-func
                                new Function("value", `return (${e.target.value})(value)`)

                                setConfig({
                                  ...config,
                                  rules: {
                                    ...config.rules,
                                    customParser: e.target.value, // Store the function as a string
                                  },
                                })
                              } catch (err) {
                                console.error("Invalid function:", err)
                              }
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Define a custom function that takes the header value as input and returns an array of tokens
                        </p>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Header Processing Context</h4>
                      <p className="text-sm text-gray-600">
                        Configure how this header interacts with the compliance framework
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="compliance-required" />
                          <Label htmlFor="compliance-required">Required for Compliance</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="log-header" />
                          <Label htmlFor="log-header">Log in Audit Trail</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="encrypt-values" />
                          <Label htmlFor="encrypt-values">Encrypt Values</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="validate-format" />
                          <Label htmlFor="validate-format">Validate Format</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="test" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-header-value">Test Header Value</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="test-header-value"
                          value={testHeaderValue}
                          onChange={(e) => setTestHeaderValue(e.target.value)}
                          placeholder="Enter a sample header value to test tokenization"
                          className="flex-1"
                        />
                        <Button onClick={handleTestTokenization} disabled={!testHeaderValue}>
                          Test
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Enter a sample value for the {selectedHeader} header to test how it will be tokenized
                      </p>
                    </div>

                    {showTestResult && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Tokenization Result:</h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="mb-2">
                            <Badge variant="outline" className="mb-2">
                              {testResult.length} tokens extracted
                            </Badge>
                          </div>

                          {testResult.length > 0 ? (
                            <div className="space-y-2">
                              {testResult.map((token, index) => (
                                <div key={index} className="flex items-center">
                                  <Badge className="mr-2 bg-gray-200 text-gray-800 min-w-[2rem] text-center">
                                    {index}
                                  </Badge>
                                  <code className="bg-white px-2 py-1 rounded border flex-1 overflow-x-auto">
                                    {token}
                                  </code>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">No tokens extracted</p>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Header Selected</h3>
                  <p className="text-gray-500 mb-4">
                    Select a header from the list or add a new one to configure its tokenization
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="quick-add">Quick Add Common Header</Label>
                    <Select
                      onValueChange={(value) => {
                        if (value && !headers.includes(value)) {
                          const updatedHeaders = [...headers, value]
                          setHeaders(updatedHeaders)
                          setSelectedHeader(value)
                          localStorage.setItem("tokenizationHeaders", JSON.stringify(updatedHeaders))
                        }
                      }}
                    >
                      <SelectTrigger id="quick-add" className="w-full">
                        <SelectValue placeholder="Select a common header" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonHeaders
                          .filter((h) => !headers.includes(h))
                          .map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-gray-500">Tokenization configurations are applied to all framework components</div>
        <Button variant="outline" onClick={() => (window.location.href = "/cms")}>
          Go to CMS
        </Button>
      </CardFooter>

      {/* Notification */}
      <div
        id="save-notification"
        className="fixed bottom-4 right-4 bg-green-100 text-green-800 p-3 rounded-md shadow-md flex items-center opacity-0 transition-opacity duration-300"
      >
        <Check className="h-5 w-5 mr-2" />
        Configuration saved successfully
      </div>
    </Card>
  )
}
