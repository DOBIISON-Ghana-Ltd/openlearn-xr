"use client";

import React from 'react'
import { Button } from '../../ui/button';
import useApi from '@/data/hooks/use-api';
import { LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function HeaderLoginBtn() {
  const { data } = useApi.query('public:user:get:me');

  if (data) {
    return null;
  }

  return (
    <Button variant="default" size="xs" render={<Link href={ROUTES.AUTH.LOGIN} />} className="rounded-sm">
      <LogInIcon />
      Login
    </Button>
  )
}
