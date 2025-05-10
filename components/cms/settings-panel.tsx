"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, RefreshCw, Shield, Bell, Globe } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    general: {
      frameworkName: "AU-Legis-Compliant AI Framework",
      organizationName: "Your Organization",
      contactEmail: "compliance@example.com",
      darkMode: false,
      language: "en-AU",
    },
    compliance: {
      checkFrequency: "hourly",
      autoRemediation: true,
      alertThreshold: "80",
      retentionPeriod: "7",
      escalationPath: "Compliance Officer, CTO, Legal Team, Regulatory Body",
    },
    notifications: {
      emailAlerts: true,
      slackIntegration: false,
      slackWebhook: "",
      criticalAlertsOnly: false,
      dailyDigest: true,
    },
    api: {
      enableApi: true,
      rateLimiting: true,
      maxRequestsPerMinute: "60",
      apiKey: "sk_live_example123456789",
      webhookUrl: "",
    },
  })

  const handleChange = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings:`, settings[section as keyof typeof settings])
    // Here you would typically save the settings to your backend
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 rounded-lg bg-gray-100 p-1">
        <TabsTrigger
          value="general"
          className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
        >
          General
        </TabsTrigger>
        <TabsTrigger
          value="compliance"
          className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
        >
          Compliance
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
        >
          Notifications
        </TabsTrigger>
        <TabsTrigger
          value="api"
          className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
        >
          API
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic framework settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="framework-name">Framework Name</Label>
                  <Input
                    id="framework-name"
                    value={settings.general.frameworkName}
                    onChange={(e) => handleChange("general", "frameworkName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Organization Name</Label>
                  <Input
                    id="organization-name"
                    value={settings.general.organizationName}
                    onChange={(e) => handleChange("general", "organizationName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => handleChange("general", "contactEmail", e.target.value)}
                />
                <p className="text-xs text-gray-500">This email will be used for system notifications and alerts.</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="cursor-pointer">
                      Dark Mode
                    </Label>
                    <Switch
                      id="dark-mode"
                      checked={settings.general.darkMode}
                      onCheckedChange={(checked) => handleChange("general", "darkMode", checked)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enable dark mode for the dashboard interface.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => handleChange("general", "language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-AU">English (Australia)</SelectItem>
                      <SelectItem value="en-US">English (United States)</SelectItem>
                      <SelectItem value="en-GB">English (United Kingdom)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Interface language and regional settings.</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("general")} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="compliance" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-emerald-600" />
              Compliance Settings
            </CardTitle>
            <CardDescription>Configure compliance checking behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="check-frequency">Check Frequency</Label>
                  <Select
                    value={settings.compliance.checkFrequency}
                    onValueChange={(value) => handleChange("compliance", "checkFrequency", value)}
                  >
                    <SelectTrigger id="check-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="on-demand">On Demand Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">How often automated compliance checks should run.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
                  <Input
                    id="alert-threshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.compliance.alertThreshold}
                    onChange={(e) => handleChange("compliance", "alertThreshold", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Compliance score threshold below which alerts will be triggered.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-remediation" className="cursor-pointer">
                      Automatic Remediation
                    </Label>
                    <Switch
                      id="auto-remediation"
                      checked={settings.compliance.autoRemediation}
                      onCheckedChange={(checked) => handleChange("compliance", "autoRemediation", checked)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Automatically attempt to fix compliance issues when possible.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention-period">Log Retention (years)</Label>
                  <Input
                    id="retention-period"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.compliance.retentionPeriod}
                    onChange={(e) => handleChange("compliance", "retentionPeriod", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">How long compliance check logs should be retained.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escalation-path">Escalation Path</Label>
                <Textarea
                  id="escalation-path"
                  value={settings.compliance.escalationPath}
                  onChange={(e) => handleChange("compliance", "escalationPath", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Comma-separated list of roles in the escalation path for compliance issues.
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("compliance")} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-emerald-600" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-alerts" className="cursor-pointer">
                    Email Alerts
                  </Label>
                  <Switch
                    id="email-alerts"
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) => handleChange("notifications", "emailAlerts", checked)}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Send email notifications for compliance issues and system events.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slack-integration" className="cursor-pointer">
                    Slack Integration
                  </Label>
                  <Switch
                    id="slack-integration"
                    checked={settings.notifications.slackIntegration}
                    onCheckedChange={(checked) => handleChange("notifications", "slackIntegration", checked)}
                  />
                </div>
                <p className="text-xs text-gray-500">Send notifications to a Slack channel.</p>
              </div>

              {settings.notifications.slackIntegration && (
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    value={settings.notifications.slackWebhook}
                    onChange={(e) => handleChange("notifications", "slackWebhook", e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <p className="text-xs text-gray-500">The webhook URL for your Slack channel.</p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical-alerts-only" className="cursor-pointer">
                      Critical Alerts Only
                    </Label>
                    <Switch
                      id="critical-alerts-only"
                      checked={settings.notifications.criticalAlertsOnly}
                      onCheckedChange={(checked) => handleChange("notifications", "criticalAlertsOnly", checked)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Only send notifications for critical compliance issues.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-digest" className="cursor-pointer">
                      Daily Digest
                    </Label>
                    <Switch
                      id="daily-digest"
                      checked={settings.notifications.dailyDigest}
                      onCheckedChange={(checked) => handleChange("notifications", "dailyDigest", checked)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Send a daily summary of compliance status.</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("notifications")} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-emerald-600" />
              API Settings
            </CardTitle>
            <CardDescription>Configure API access and integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-api" className="cursor-pointer">
                    Enable API
                  </Label>
                  <Switch
                    id="enable-api"
                    checked={settings.api.enableApi}
                    onCheckedChange={(checked) => handleChange("api", "enableApi", checked)}
                  />
                </div>
                <p className="text-xs text-gray-500">Allow external systems to access the framework via API.</p>
              </div>

              {settings.api.enableApi && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="rate-limiting" className="cursor-pointer">
                          Rate Limiting
                        </Label>
                        <Switch
                          id="rate-limiting"
                          checked={settings.api.rateLimiting}
                          onCheckedChange={(checked) => handleChange("api", "rateLimiting", checked)}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Limit the number of API requests per minute.</p>
                    </div>

                    {settings.api.rateLimiting && (
                      <div className="space-y-2">
                        <Label htmlFor="max-requests">Max Requests Per Minute</Label>
                        <Input
                          id="max-requests"
                          type="number"
                          min="1"
                          value={settings.api.maxRequestsPerMinute}
                          onChange={(e) => handleChange("api", "maxRequestsPerMinute", e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex">
                      <Input id="api-key" value={settings.api.apiKey} readOnly className="rounded-r-none" />
                      <Button
                        variant="outline"
                        className="rounded-l-none border-l-0"
                        onClick={() => console.log("Regenerate API key")}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Your API key for authentication. Keep this secure.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-system.com/webhook"
                      value={settings.api.webhookUrl}
                      onChange={(e) => handleChange("api", "webhookUrl", e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      URL to receive webhook notifications about compliance events.
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button onClick={() => handleSave("api")} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
