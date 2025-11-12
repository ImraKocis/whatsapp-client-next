import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/lib/api/user/user";

const fontSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WhatsApp Clone Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html lang="en">
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <Providers user={user}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
