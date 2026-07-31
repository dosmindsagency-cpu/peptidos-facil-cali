import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedContent, GoalExplorer, LegalTrustStrip, ProviderGuide, QuickAccess, ToolsSection, TrustSection } from "@/components/home/HomeSections";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/env";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Péptidos Fácil Cali | Información y herramientas sobre péptidos",
  description: "Aprende sobre péptidos con guías claras, herramientas educativas, calculadoras y recursos diseñados para ayudarte a tomar decisiones informadas.",
  alternates: { canonical: getSiteUrl() },
  openGraph: { type: "website", locale: "es_CO", url: getSiteUrl(), siteName: siteConfig.name, title: "Péptidos Fácil Cali | Información y herramientas sobre péptidos", description: "Aprende sobre péptidos con guías claras, herramientas educativas, calculadoras y recursos diseñados para ayudarte a tomar decisiones informadas." },
  twitter: { card: "summary_large_image", title: "Péptidos Fácil Cali | Información y herramientas sobre péptidos", description: "Guías claras y herramientas educativas sobre péptidos." },
};

export default function HomePage() {
  return <><HeroSection /><QuickAccess /><GoalExplorer /><TrustSection /><FeaturedContent /><ToolsSection /><ProviderGuide /><LegalTrustStrip /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]) }} /></>;
}