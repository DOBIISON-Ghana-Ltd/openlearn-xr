import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CookieConsentBanner } from "@/components/ui/cookie-consent-banner";
import { AnalyticsProvider } from "@/adapters/analytics/provider";
import { QueryProvider } from "@/components/providers/query-provider";

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});
const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenLearn - Interactive 3D Science Labs",
  description: "Experience virtual physics, chemistry, and biology experiments directly in your web browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable, interHeading.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AnalyticsProvider>
            {children}
            <CookieConsentBanner />
          </AnalyticsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
