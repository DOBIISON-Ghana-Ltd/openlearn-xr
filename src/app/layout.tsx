import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Google_Sans_Flex, Google_Sans_Code } from "next/font/google";
import { cn } from "@/lib/utils/cn";
import "./globals.css";
import Providers from "@/components/common/providers";

const sans = Google_Sans_Flex({ subsets: ['latin'], variable: '--font-sans', adjustFontFallback: false });
const heading = Google_Sans_Flex({ subsets: ['latin'], variable: '--font-heading', adjustFontFallback: false });
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
