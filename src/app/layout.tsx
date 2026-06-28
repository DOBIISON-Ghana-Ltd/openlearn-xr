import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils/cn";
import "./globals.css";
import Providers from "@/components/common/providers";

const sans = localFont({ src: './fonts/GoogleSansFlex.ttf', variable: '--font-sans' });
const heading = localFont({ src: './fonts/GoogleSansFlex.ttf', variable: '--font-heading', weight: '700' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: "OpenLearn - Interactive 3D Science Labs",
    template: "%s | OpenLearn",
  },
  description: "Experience virtual physics, chemistry, and biology experiments directly in your web browser.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", sans.variable, heading.variable, mono.variable)}
    >
      <body className="relative">
        <Providers>
          <div className="isolate relative flex min-h-svh flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
