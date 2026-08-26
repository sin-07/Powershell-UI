import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AASM Shell - Production-Grade Windows Terminal",
  description: "High-performance standalone Windows terminal engineered in Rust and Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="h-screen w-screen overflow-hidden antialiased bg-background text-foreground select-none">
        {children}
      </body>
    </html>
  );
}
