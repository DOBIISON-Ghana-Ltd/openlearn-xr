import type { Metadata } from "next";
import localFont from 'next/font/local';
import { cn } from "@/lib/utils/cn";
import "./globals.css";
import Providers from "@/components/(new)/common/providers";

const sans = localFont({ src: './fonts/Sora.ttf', variable: '--font-sans' });

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
      className={cn("h-full", "antialiased", "font-sans", sans.variable)}
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
