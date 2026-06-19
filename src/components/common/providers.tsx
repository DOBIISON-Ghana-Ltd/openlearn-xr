"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast"
import { getQueryClient } from "@/lib/utils/get-query-client";
import { useState } from 'react';
import AnalyticsProvider from '@/adapters/analytics/provider';
import { CookieConsentBanner } from '../ui/cookie-consent-banner';

export default function Providers({ children }: { children: React.ReactNode; }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <AnchoredToastProvider>
              {children}
            </AnchoredToastProvider>
          </ToastProvider>
          {/* <CookieConsentBanner /> */}
        </ThemeProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  )
};