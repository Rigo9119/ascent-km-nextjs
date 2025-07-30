import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/app-sidebar/sidebar-layout";
import { AuthProvider } from "@/contexts/auth-context";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";


const geistSans: NextFontWithVariable = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono: NextFontWithVariable = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Nextroots',
    default: 'Home',
  },
  description: 'Nextroots page',
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>): Promise<React.ReactNode> {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SidebarLayout>
            {children}
          </SidebarLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
