import "./globals.css";

export const metadata = { title: "Genesis Virtue | Business Directory", description: "Find trusted local businesses across India with Genesis Virtue." };

export default function RootLayout({ children }) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full flex flex-col">{children}</body></html>;
}
