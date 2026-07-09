import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"]
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "JOY Celebrations | Premium Private Party Theatre",
  description: "Celebrate every moment in style at JOY Celebrations, Vijayawada's premium private party theatre. Book your luxury birthday, anniversary, or surprise party today.",
  openGraph: {
    title: "JOY Celebrations | Premium Private Party Theatre",
    description: "Celebrate every moment in style at JOY Celebrations, Vijayawada's premium private party theatre.",
    url: "https://joycelebrations.com",
    siteName: "JOY Celebrations",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable}`}>
        <Navbar />
        <main>{children}</main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
