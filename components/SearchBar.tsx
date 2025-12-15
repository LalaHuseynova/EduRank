'use client'

import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'


interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  initialValue?: string
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </form>
  )
}





