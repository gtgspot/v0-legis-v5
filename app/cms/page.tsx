"use client"

import { CMSDashboard } from "@/components/cms/dashboard"

export default function CMSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CMSDashboard />
      </div>
    </div>
  )
}
