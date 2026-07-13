"use client";

import useApi from '@/data/hooks/use-api';
import React from 'react'

export default function HeaderUserStats() {
  const { data } = useApi.query('public:user:get:me');

  if (!data) {
    return null;
  }

  return (
    <p className="text-xs font-normal">Points | Streaks | Badges</p>
  )
}
