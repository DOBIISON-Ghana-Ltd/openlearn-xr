"use client";

import React from 'react'
import { Book } from '@/lib/constants/data';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';

export default function BookCard(props: Book) {
  const router = useRouter();
  const { subject, grade, total, id, status } = props;

  return (
    <div className="relative w-full aspect-video p-4 flex flex-col gap-2 border">
      <div className="flex justify-between items-center">
        <p className="text-xs-m font-normal font-mono tracking-wide">
          00/{total.toString().padStart(2, "0")}
        </p>
      </div>
      <div className='flex-1 space-y-0'>
        <h3 className="text-base leading-snug">{subject}</h3>
        <p className="text-sm text-muted-foreground font-normal">
          {grade}
        </p>
      </div>
      <div className='flex flex-col gap-1'>
        <Button
          size="sm"
          variant={status === "pending" ? "secondary" : "default"}
          className="w-full rounded-none"
          disabled={status === "pending"}
          onClick={() => router.push(`/app/library?book=${id}`)}
        >
          {status === "pending" ? "Coming Soon" : "Explore"}
        </Button>
      </div>
    </div>
  )
}
