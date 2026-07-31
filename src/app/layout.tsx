import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileQuickNav } from "@/components/layout/MobileQuickNav";
import { siteConfig } from "@/config/site";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { getSiteUrl } from "@/env";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: `${siteConfig.name} Editorial` }],
  generator: "Next.js",
  keywords: ["péptidos", "GLP-1", "salud metabólica", "California", "educación", "español"],
  alternates: { canonical: "/", languages: { es: "/" } },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: getSiteUrl(),
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image", title: siteConfig.name },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: "#081522",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={sans.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-pf-navy-immersive font-sans text-[#eaf3fa] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-pf-petroleum focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido principal
        </a>
        <SiteHeader />
        <main id="main" className="pb-28 pt-20">
          {children}
        </main>
        <SiteFooter />
        <MobileQuickNav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
