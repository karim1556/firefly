import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "../styles/fonts.css";
import "../styles/theme.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "Firefly Health",
  description: "School wellbeing platform for multi-tier care management"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-body min-h-screen bg-zinc-50 text-zinc-900 antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
