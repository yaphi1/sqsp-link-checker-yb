import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Sqsp Link Checker",
  description: "Checks whether links still work and are still sqsp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/paste-your-own">Paste Your Own Links</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
