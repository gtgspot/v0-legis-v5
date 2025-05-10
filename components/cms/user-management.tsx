"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Filter, ArrowUpDown, MoreHorizontal, UserPlus, Mail, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserManagement() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer",
  })

  // Mock user data
  const users = [
    {
      id: "user-1",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "admin",
      lastActive: "2025-04-23T09:15:22",
    },
    {
      id: "user-2",
      name: "David Wilson",
      email: "david.wilson@example.com",
      role: "editor",
      lastActive: "2025-04-23T08:30:00",
    },
    {
      id: "user-3",
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      role: "editor",
      lastActive: "2025-04-22T16:45:12",
    },
    {
      id: "user-4",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      role: "viewer",
      lastActive: "2025-04-22T14:22:05",
    },
    {
      id: "user-5",
      name: "James Smith",
      email: "james.smith@example.com",
      role: "viewer",
      lastActive: "2025-04-21T11:10:45",
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

  const handleInputChange = (field: string, value: string) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddUser = () => {
    console.log("Adding new user:", newUser)
    // Here you would typically add the user to your backend
    setShowAddUser(false)
    setNewUser({
      name: "",
      email: "",
      role: "viewer",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user access and permissions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search users..."
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
        <div className="flex justify-end mb-4">
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Add a new user to the compliance management system.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., John Smith"
                    value={newUser.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., john.smith@example.com"
                    value={newUser.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Admin:</span> Full access to all features
                    <br />
                    <span className="font-medium">Editor:</span> Can edit rules but not manage users
                    <br />
                    <span className="font-medium">Viewer:</span> Read-only access
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.email}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-gray-100 text-sm font-medium text-gray-500 border-b">
            <div className="col-span-4 p-3">User</div>
            <div className="col-span-3 p-3">Email</div>
            <div className="col-span-2 p-3">Role</div>
            <div className="col-span-2 p-3">Last Active</div>
            <div className="col-span-1 p-3 text-right">Actions</div>
          </div>
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-12 text-sm border-b last:border-b-0 hover:bg-gray-50">
              <div className="col-span-4 p-3 font-medium flex items-center">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mr-3">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                {user.name}
              </div>
              <div className="col-span-3 p-3 flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                {user.email}
              </div>
              <div className="col-span-2 p-3 flex items-center">
                <Badge
                  className={
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "editor"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {user.role}
                </Badge>
              </div>
              <div className="col-span-2 p-3 flex items-center text-gray-500">{formatDate(user.lastActive)}</div>
              <div className="col-span-1 p-3 text-right">
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
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem>View Activity</DropdownMenuItem>
                    <DropdownMenuItem>Reset Password</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Role Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <Badge className="bg-purple-100 text-purple-800 mb-2">Admin</Badge>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Manage users and roles</li>
                    <li>• Create and edit all rules</li>
                    <li>• Configure system settings</li>
                    <li>• View audit logs</li>
                    <li>• Generate reports</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">Editor</Badge>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Create and edit rules</li>
                    <li>• Link legal sources</li>
                    <li>• Run compliance checks</li>
                    <li>• View audit logs</li>
                    <li>• Generate reports</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <Badge className="bg-gray-100 text-gray-800 mb-2">Viewer</Badge>
                  <ul className="space-y-1 text-gray-600">
                    <li>• View all rules</li>
                    <li>• View compliance status</li>
                    <li>• View reports</li>
                    <li>• No edit permissions</li>
                    <li>• No user management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
