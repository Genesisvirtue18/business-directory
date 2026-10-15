import "./globals.css";
import { Inter, Space_Grotesk, Noto_Sans_Devanagari } from "next/font/google";
import LocationPermissionOnEntry from "@/components/LocationPermissionOnEntry";

// Body / UI typeface: Inter is built for dense listing data — it stays legible at
// small sizes and keeps numbers (ratings, phone numbers, distances) unambiguous.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

// Display typeface: Space Grotesk adds a crisp, modern character to headings
// and key numbers while Inter keeps dense listing content easy to scan.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Devanagari fallback so Hindi / Marathi business names render in the same voice
// instead of dropping to an arbitrary system font. preload is off, so English
// pages never download it.
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  preload: false,
});

export const metadata = { title: "Genesis Virtue | Business Directory", description: "Find trusted local businesses across India with Genesis Virtue." };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${spaceGrotesk.variable} ${devanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <LocationPermissionOnEntry />
        {children}
      </body>
    </html>
  );
}
