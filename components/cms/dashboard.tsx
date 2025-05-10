"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  FileText,
  Settings,
  Users,
  PlusCircle,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { RuleEditor } from "./rule-editor"
import { UserManagement } from "./user-management"
import { AuditLogs } from "./audit-logs"
import { SettingsPanel } from "./settings-panel"

export function CMSDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showRuleEditor, setShowRuleEditor] = useState(false)
  const [selectedRule, setSelectedRule] = useState<any>(null)

  const handleEditRule = (rule: any) => {
    setSelectedRule(rule)
    setShowRuleEditor(true)
  }

  const handleCreateRule = () => {
    setSelectedRule(null)
    setShowRuleEditor(true)
  }

  const handleCloseRuleEditor = () => {
    setShowRuleEditor(false)
    setSelectedRule(null)
  }

  // Mock data for the dashboard
  const recentActivity = [
    {
      id: "act-1",
      action: "Rule Updated",
      user: "Sarah Chen",
      timestamp: "2025-04-23T09:15:22",
      details: "Updated PRIV-01 to reflect new Privacy Act amendments",
    },
    {
      id: "act-2",
      action: "Compliance Check",
      user: "System",
      timestamp: "2025-04-23T08:30:00",
      details: "Automated compliance check completed - 98% compliance score",
    },
    {
      id: "act-3",
      action: "User Added",
      user: "Admin",
      timestamp: "2025-04-22T16:45:12",
      details: "Added new compliance officer: Michael Johnson",
    },
    {
      id: "act-4",
      action: "Rule Created",
      user: "David Wilson",
      timestamp: "2025-04-22T14:22:05",
      details: "Created new rule CONSUMER-02 for misleading AI outputs",
    },
  ]

  const rules = [
    {
      id: "PRIV-01",
      title: "Data Must Be Handled Lawfully",
      source: "Privacy Act 1988 (Cth)",
      category: "privacy",
      status: "active",
      lastUpdated: "2025-04-20T10:15:00",
    },
    {
      id: "PRIV-02",
      title: "De-identification of Personal Data",
      source: "Privacy Act 1988 (Cth)",
      category: "privacy",
      status: "active",
      lastUpdated: "2025-04-18T14:30:00",
    },
    {
      id: "CONSUMER-01",
      title: "No Misleading Outputs",
      source: "Australian Consumer Law (ACL)",
      category: "consumer",
      status: "active",
      lastUpdated: "2025-04-15T09:45:00",
    },
    {
      id: "CRIM-01",
      title: "Prevent Unauthorised Access",
      source: "Criminal Code Act 1995 (Cth)",
      category: "security",
      status: "active",
      lastUpdated: "2025-04-10T16:20:00",
    },
    {
      id: "WHS-01",
      title: "Safety Protocols for AI in Workplaces",
      source: "Work Health and Safety Act 2011 (Cth)",
      category: "safety",
      status: "active",
      lastUpdated: "2025-04-05T11:10:00",
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-AU", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {showRuleEditor ? (
        <RuleEditor rule={selectedRule} onClose={handleCloseRuleEditor} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
              <p className="text-gray-500">Manage compliance rules, users, and system settings</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCreateRule}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Create Rule
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Reports
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>Current compliance metrics and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div className="text-emerald-800 font-medium">Compliance Score</div>
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-700 mt-2">98%</div>
                    <div className="text-xs text-emerald-600 mt-1">+2% from last check</div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center justify-between">
                      <div className="text-amber-800 font-medium">Active Alerts</div>
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="text-3xl font-bold text-amber-700 mt-2">2</div>
                    <div className="text-xs text-amber-600 mt-1">Requires attention</div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="text-blue-800 font-medium">Next Check</div>
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mt-2">1h 23m</div>
                    <div className="text-xs text-blue-600 mt-1">Automated compliance check</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Recent Activity</h3>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-start"
                      >
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                            activity.action === "Rule Updated"
                              ? "bg-blue-100 text-blue-600"
                              : activity.action === "Compliance Check"
                                ? "bg-emerald-100 text-emerald-600"
                                : activity.action === "User Added"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          {activity.action === "Rule Updated" && <FileText className="h-4 w-4" />}
                          {activity.action === "Compliance Check" && <Shield className="h-4 w-4" />}
                          {activity.action === "User Added" && <Users className="h-4 w-4" />}
                          {activity.action === "Rule Created" && <PlusCircle className="h-4 w-4" />}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-900">{activity.action}</div>
                            <div className="text-xs text-gray-500">{formatDate(activity.timestamp)}</div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{activity.details}</div>
                          <div className="text-xs text-gray-500 mt-1">By: {activity.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>System overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Total Rules</div>
                    <div className="text-2xl font-bold">{rules.length}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Privacy: 2</Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Consumer: 1</Badge>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Security: 1</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Safety: 1</Badge>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Active Users</div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Admins: 2</Badge>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Editors: 5</Badge>
                      <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Viewers: 5</Badge>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">System Status</div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                      <div className="text-lg font-medium">All Systems Operational</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Last updated: 5 minutes ago</div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Detailed Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-lg bg-gray-100 p-1">
              <TabsTrigger
                value="rules"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Rules
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Audit Logs
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>Compliance Rules</CardTitle>
                      <CardDescription>Manage and edit compliance rules</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search rules..."
                        className="max-w-xs"
                        onChange={(e) => console.log("Search:", e.target.value)}
                      />
                      <Button variant="outline" size="icon" title="Filter">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Sort">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-gray-100 text-sm font-medium text-gray-500 border-b">
                      <div className="col-span-2 p-3">ID</div>
                      <div className="col-span-4 p-3">Title</div>
                      <div className="col-span-2 p-3">Category</div>
                      <div className="col-span-2 p-3">Status</div>
                      <div className="col-span-2 p-3 text-right">Actions</div>
                    </div>
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="grid grid-cols-12 text-sm border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="col-span-2 p-3 font-medium">{rule.id}</div>
                        <div className="col-span-4 p-3">{rule.title}</div>
                        <div className="col-span-2 p-3">
                          <Badge
                            className={
                              rule.category === "privacy"
                                ? "bg-blue-100 text-blue-800"
                                : rule.category === "consumer"
                                  ? "bg-green-100 text-green-800"
                                  : rule.category === "security"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {rule.category}
                          </Badge>
                        </div>
                        <div className="col-span-2 p-3">
                          <Badge
                            className={
                              rule.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {rule.status}
                          </Badge>
                        </div>
                        <div className="col-span-2 p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditRule(rule)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View History</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <AuditLogs />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
