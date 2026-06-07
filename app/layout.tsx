import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils/cn";
import "./globals.css";
import Providers from "@/components/common/providers";

const interHeading = Inter({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
      className={cn("h-full", "antialiased", "font-sans", inter.variable, interHeading.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
