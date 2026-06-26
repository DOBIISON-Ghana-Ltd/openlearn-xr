'use client'

import { useParams } from 'next/navigation'
import { ModuleCard } from '@/components/cards/module-card'
import { MOCK_LIBRARY, MOCK_MODULES } from '@/lib/constants/data'
import { notFound } from 'next/navigation'

export default function ClientPage() {
  const { id } = useParams<{ id: string }>()
  const collection = MOCK_LIBRARY.find((c) => c.id === id)

  if (!collection) {
    notFound()
  }

  // Filter modules for this collection
  const explicitModules = MOCK_MODULES.filter((m) => m.collectionId === id)

  // Fallback module generation for collections without static mock data
  const displayModules = explicitModules.length > 0
    ? explicitModules
    : Array.from({ length: collection.totalModules }, (_, i) => ({
        id: `${collection.id}-gen-${i + 1}`,
        collectionId: collection.id,
        title: `${collection.subject} Experiment ${i + 1}`,
        subject: collection.subject,
        grade: collection.grade,
        totalCheckpoints: 10 + ((i * 3) % 15),
        isCompleted: true,
        isLocked: false,
      }))

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-14">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Library</h1>
        <p className="text-lg text-muted-foreground mt-2">{collection.subject} — {collection.grade}</p>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            hasLicense={false}
          />
        ))}
      </div>
    </div>
  )
}
