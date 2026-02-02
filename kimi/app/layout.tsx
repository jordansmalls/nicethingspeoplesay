// app/layout.tsx
import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "NTPS - Nice Things People Say",
  description: "Collect and cherish nice things people say about you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interTight.variable}>
      <body className="font-sans antialiased bg-white text-neutral-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}