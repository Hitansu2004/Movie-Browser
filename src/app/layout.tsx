import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
// Temporarily bypassing ClientLayout to isolate runtime error.
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Cinemate - Movie Browser | Discover Amazing Movies",
  description: "Discover and explore the latest movies, popular films, top-rated cinema, and upcoming releases with Cinemate - your ultimate movie browsing experience.",
  keywords: ["movies", "cinema", "film", "entertainment", "movie browser", "movie database"],
  authors: [{ name: "Hitansu Parichha" }],
  creator: "Hitansu Parichha",
  publisher: "Hitansu Parichha",
  openGraph: {
    title: "Cinemate - Movie Browser",
    description: "Discover and explore amazing movies with Cinemate",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinemate - Movie Browser",
    description: "Discover and explore amazing movies with Cinemate",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={`${poppins.className} antialiased bg-white dark:bg-gray-900 transition-colors duration-300`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
