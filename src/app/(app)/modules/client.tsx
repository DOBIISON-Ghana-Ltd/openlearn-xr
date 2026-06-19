'use client'

import { Search } from 'lucide-react'
import { ModuleCard } from '@/components/cards/module-card'
import { MOCK_MODULES } from '@/lib/constants/data'
import { nuqs } from '@/lib/utils/nuqs'
import { Paginator } from '@/components/particles/paginator'

const PAGE_SIZE = 12

export default function ClientPage() {
  const [{ q, page }, setParams] = nuqs.getStates('modules')

  const currentPage = Math.max(1, parseInt(page, 10) || 1)

  // Client-side filter
  const filtered = MOCK_MODULES.filter((m) =>
    m.title.toLowerCase().includes(q.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (value: string) => {
    setParams({ q: value, page: '1' })
  }

  const handlePage = (p: number) => {
    setParams({ page: String(p) })
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-14">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-10">Modules</h1>

      {/* Search bar */}
      <div className="relative mb-10 max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Search modules…"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-11 rounded-full border border-border bg-background pl-11 pr-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background transition-shadow"
          id="modules-search"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {paged.length > 0 ? (
          paged.map((module) => (
            <ModuleCard
              key={module.id}
              module={{ ...module, isLocked: false }}
              hasLicense={false}
              playMode='module'
            />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-16 text-sm">
            No modules match &ldquo;{q}&rdquo;
          </p>
        )}
      </div>

      {/* Pagination */}
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePage}
      />
    </div>
  )
}
