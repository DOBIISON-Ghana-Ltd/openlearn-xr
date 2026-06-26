"use client";

import { authClient } from '@/adapters/auth/client';
import { ROUTES } from '@/lib/constants/routes';
import { nuqs } from '@/lib/utils/nuqs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const [state] = nuqs.getStates('verifyCache');

  useEffect(() => {
    let active = true;

    const run = async () => {
      const { data: session } = await authClient.getSession();

      if (session) {
        if (!active) return;

        router.replace(state.redirect || ROUTES.SIMS.DASHBOARD);
        router.refresh();
      } else {
        await authClient.signOut();
        if (!active) return;

        const redirectUrl = nuqs.getUrl('login', { redirect: state.redirect }, ROUTES.AUTH.LOGIN);
        router.replace(redirectUrl);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [router, state.redirect]);

  return (
    <main className='flex-1 flex-center'>
      <div className="flex flex-col gap-2 items-center">
        <Loader className='size-5 animate-spin' />
        <p className="text-sm font-medium text-muted-foreground">Verifying access...</p>
      </div>
    </main>
  )
}
