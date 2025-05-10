"use client"

import type React from "react"

import { useState, useEffect, forwardRef } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (term: string) => void
  placeholder?: string
  initialValue?: string
  className?: string
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, placeholder = "Search...", initialValue = "", className = "" }, ref) => {
    const [searchTerm, setSearchTerm] = useState(initialValue)

    // Update search term when initialValue changes
    useEffect(() => {
      setSearchTerm(initialValue)
    }, [initialValue])

    const handleSearch = () => {
      onSearch(searchTerm)
    }

    const handleClear = () => {
      setSearchTerm("")
      onSearch("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    }

    return (
      <div className={`relative flex items-center ${className}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-10 flex items-center pr-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          onClick={handleSearch}
          className="absolute right-0 h-full rounded-l-none bg-emerald-600 hover:bg-emerald-700"
          aria-label="Search"
        >
          Search
        </Button>
      </div>
    )
  },
)

SearchBar.displayName = "SearchBar"
