import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
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
  metadataBase: new URL('https://joy-celebrations-private-theatre.vercel.app'),
  title: {
    default: "JOY Celebrations | Premium Private Party Theatre in Vijayawada",
    template: "%s | JOY Celebrations",
  },
  description: "Celebrate every moment in style at JOY Celebrations, Vijayawada's premium private party theatre. Book your luxury birthday, anniversary, or surprise party today.",
  keywords: ["Private Party Theatre in Vijayawada", "Birthday Celebration Vijayawada", "Anniversary Celebration Vijayawada", "Proposal Decoration Vijayawada", "Romantic Date Night Vijayawada"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "JOY Celebrations | Premium Private Party Theatre in Vijayawada",
    description: "Celebrate every moment in style at JOY Celebrations, Vijayawada's premium private party theatre.",
    url: "https://joy-celebrations-private-theatre.vercel.app",
    siteName: "JOY Celebrations",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: '/hero-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JOY Celebrations Private Theatre',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JOY Celebrations | Premium Private Party Theatre in Vijayawada',
    description: 'Vijayawada\'s premium private party theatre for birthdays, anniversaries, and surprise events.',
    images: ['/hero-image.jpg'],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Organization", "WebSite"],
  "name": "JOY Celebrations",
  "url": "https://joy-celebrations-private-theatre.vercel.app",
  "logo": "https://joy-celebrations-private-theatre.vercel.app/logo.png",
  "image": "https://joy-celebrations-private-theatre.vercel.app/hero-image.jpg",
  "description": "Premium Private Party Theatre in Vijayawada for Birthdays, Anniversaries, and Special Occasions.",
  "telephone": "+91-9999999999", 
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Vijayawada",
    "addressLocality": "Vijayawada",
    "addressRegion": "Andhra Pradesh",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "16.5062",
    "longitude": "80.6480"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ],
    "opens": "09:00",
    "closes": "02:00"
  },
  "priceRange": "₹₹",
  "sameAs": [
    "https://www.instagram.com/joy.celebrations/"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} ${playfair.variable}`}>
        <Navbar />
        <main>{children}</main>
        <WhatsAppButton />
        <ConditionalFooter />
      </body>
    </html>
  );
}
