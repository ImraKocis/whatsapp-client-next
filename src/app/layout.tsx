import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WhatsApp Clone Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <div className="flex">{children}</div>
      </body>
    </html>
  );
}
