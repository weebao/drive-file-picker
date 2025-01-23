import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Picker",
  description: "A simple file picker app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <head>
        <Script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          async
          strategy="beforeInteractive"
        />
      </head> */}
      <body className={inter.className}>
        <Providers>
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </Providers>
      </body>
    </html>
  );
}
