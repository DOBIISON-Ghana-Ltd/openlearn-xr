'use client'

import { LibraryCard } from '@/components/cards/library-card'
import { MOCK_LIBRARY } from '@/lib/constants/data'

export default function ClientPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-center mb-10">Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_LIBRARY.map((collection) => (
          <LibraryCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  )
}
