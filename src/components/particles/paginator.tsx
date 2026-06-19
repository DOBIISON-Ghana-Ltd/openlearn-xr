'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

export interface PaginatorProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Paginator({ currentPage, totalPages, onPageChange }: PaginatorProps) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              buttonVariants({ size: 'default', variant: 'ghost' }),
              !hasPrev && 'pointer-events-none opacity-40'
            )}
            render={
              <button
                type="button"
                onClick={() => hasPrev && onPageChange(currentPage - 1)}
                disabled={!hasPrev}
              />
            }
          />
        </PaginationItem>

        {/* Page dots */}
        {Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1
          return (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={currentPage === p}
                className={cn(
                  buttonVariants({
                    size: 'icon',
                    variant: currentPage === p ? 'outline' : 'ghost',
                  })
                )}
                render={
                  <button
                    type="button"
                    onClick={() => onPageChange(p)}
                  />
                }
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            className={cn(
              buttonVariants({ size: 'default', variant: 'ghost' }),
              !hasNext && 'pointer-events-none opacity-40'
            )}
            render={
              <button
                type="button"
                onClick={() => hasNext && onPageChange(currentPage + 1)}
                disabled={!hasNext}
              />
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
