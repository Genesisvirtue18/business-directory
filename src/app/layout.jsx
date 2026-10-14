import "./globals.css";
import LocationPermissionOnEntry from "@/components/LocationPermissionOnEntry";

export const metadata = { title: "Genesis Virtue | Business Directory", description: "Find trusted local businesses across India with Genesis Virtue." };

export default function RootLayout({ children }) {
  return <html lang="en" className="h-full antialiased" suppressHydrationWarning><body className="min-h-full flex flex-col"><LocationPermissionOnEntry />{children}</body></html>;
}
