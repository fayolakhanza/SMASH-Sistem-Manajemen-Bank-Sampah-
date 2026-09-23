import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "Bank Sampah Digital & Daur Ulang | Eco-Waste Management",
  description:
    "Sistem manajemen bank sampah digital terintegrasi – setorkan sampah, kumpulkan poin, dan tukarkan dengan hadiah menarik.",
  keywords: "bank sampah, daur ulang, eco, lingkungan, poin, hadiah, digital",
  openGraph: {
    title: "Bank Sampah Digital & Daur Ulang",
    description: "Solusi pengelolaan sampah digital yang modern dan ramah lingkungan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
