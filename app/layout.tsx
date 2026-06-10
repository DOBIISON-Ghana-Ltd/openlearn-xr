import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils/cn";
import "./globals.css";
import Providers from "@/components/common/providers";

const fontSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const fontHeading = Geist({ variable: "--font-heading", subsets: ["latin"], weight: "600" });
const fontMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

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
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        fontSans.variable,
        fontHeading.variable,
        fontMono.variable
      )}
    >
      <body className="relative">
        <div className="isolate relative flex min-h-svh flex-col">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
