import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
