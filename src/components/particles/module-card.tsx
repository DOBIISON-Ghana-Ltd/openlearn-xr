"use client";

import React from 'react'
import { Button } from '@/components/ui/button';
import { Module } from '@/lib/constants/data';
import { ROUTES } from '@/lib/constants/routes';
import { useRouter } from 'next/navigation';
import { BadgeCheckIcon } from 'lucide-react';

type IProps =  {
  mode?: 'session' | 'module' | 'library'
  grade?: string,
  subject?: string
} & Module;

export default function ModuleCard(props: IProps) {
  const router = useRouter();
  const { id, title, checkpoints, subject, grade, status, mode="module" } = props;

  return (
    <div className="relative w-full aspect-video p-4 flex flex-col gap-2 border">
      <div className="flex justify-between items-center">
        <p className="text-xs-m font-normal font-mono tracking-wide">
          00/{checkpoints.toString().padStart(2, "0")}
        </p>
        <BadgeCheckIcon className="text-muted-foreground size-4" />
      </div>
      <div className='flex-1'>
        <h3 className="text-base leading-snug">{title}</h3>
      </div>
      <div className='flex flex-col gap-1'>
        <div className="flex items-center">
          <p className="text-xs-m text-muted-foreground font-normal">
            {subject && grade ? `${subject} • ${grade}` : null}
          </p>
        </div>
        <Button 
          size="sm" 
          variant={status === "pending" ? "secondary" : "default"}
          className="w-full rounded-none"
          disabled={status === "pending"}
          onClick={() => router.push(ROUTES.SIMS.PLAY(mode, id))}
        >
          {status === "pending"? "Coming Soon" : "Play"}
        </Button>
      </div>
    </div>
  )
}
