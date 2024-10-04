import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Head from 'next/head';

const trenchFont = localFont({
  src: "./fonts/TrenchThin.ttf",
  variable: "--font-trench",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "nyovhz",
  description: "Digital Artist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${trenchFont.variable} antialiased select-none`}
      >
        {children}
      </body>
    </html>
  );
}
