import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/app-sidebar/sidebar-layout";
import { createSupabaseClient } from "@/lib/supabase/server";
import { AuthProvider } from "@/contexts/auth-context";
import { SupabaseClient, User } from "@supabase/supabase-js";
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

export async function getUser(): Promise<User | null> {
  const supabase: SupabaseClient = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>): Promise<React.ReactNode> {
  const user: User | null = await getUser()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SidebarLayout user={user}>
            {children}
          </SidebarLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
