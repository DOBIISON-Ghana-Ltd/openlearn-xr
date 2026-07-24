"use client";

import useApi from '@/data/hooks/use-api';
import { AwardIcon, FlameIcon, RocketIcon } from 'lucide-react';
import React from 'react'

export default function HeaderUserStats() {
  const { data } = useApi.query('app:user:get:me');

  if (!data) {
    return null;
  }

  const dummyStats = [
    { icon: RocketIcon, value: "2000" },
    { icon: FlameIcon, value: "5" },
    { icon: AwardIcon, value: "20" },
  ]

  return (
    <div className="flex-center gap-1">
      {dummyStats.map((stat, index) => (
        <div key={index} className="flex-center gap-1 px-1 py-0.5 rounded-sm shrink-0">
          <stat.icon strokeWidth={1.5} className='size-4 text-muted-foreground' />
          <p className="text-xs-m font-normal text-muted-foreground">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
