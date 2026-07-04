import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";

// Correct font import for Inter as per Next.js
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// SEO optimized metadata for Business-Flow CRM
export const metadata: Metadata = {
  title:
    "Business-Flow CRM | Customer Relationship Management for Modern Teams",
  description:
    "Business-Flow CRM empowers businesses to manage customers efficiently. Streamline your workflow, track leads, automate tasks, and grow customer relationships with Business-Flow CRM.",
  keywords: [
    "CRM",
    "Customer Relationship Management",
    "Business-Flow",
    "Leads",
    "Clients",
    "Workflow Automation",
    "Sales Tool",
    "SaaS",
    "Small Business",
    "Manage Customers",
    "Customer Notes",
    "Sales CRM",
    "Business CRM",
  ],
  openGraph: {
    title: "Business-Flow CRM | Powerful Customer Management",
    description:
      "Transform how your team manages client relationships with Business-Flow CRM. Intuitive, fast, and built for modern business success.",
    url: "https://your-business-flow-domain.com",
    siteName: "Business-Flow CRM",
    images: [
      {
        url: "https://your-business-flow-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Business-Flow CRM Dashboard Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business-Flow CRM | Customer Relationship Management",
    description:
      "Grow your business and manage leads more efficiently with Business-Flow CRM.",
    images: ["https://your-business-flow-domain.com/og-image.jpg"],
  },
  robots: "index, follow",
};

// Layout component in Next.js App Router should be a Server Component that returns html/body structure and applies font variable classes to <html>
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
