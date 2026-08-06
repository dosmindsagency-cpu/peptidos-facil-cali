import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ContextSection, FinalChatCta, PepCapabilities, QuickTools } from "@/components/home/HomeSections";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/env";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Péptidos Fácil Cali | Pep AI para entender mejor",
  description: "Habla con Pep AI para explorar péptidos, comparar información, usar calculadoras educativas y encontrar recursos confiables.",
  alternates: { canonical: getSiteUrl() },
  openGraph: { type: "website", locale: "es_CO", url: getSiteUrl(), siteName: siteConfig.name, title: "Péptidos Fácil Cali | Pep AI para entender mejor", description: "Explora péptidos con Pep AI, contexto de seguridad y recursos educativos confiables." },
  twitter: { card: "summary_large_image", title: "Péptidos Fácil Cali | Pep AI para entender mejor", description: "Explora péptidos con contexto y fuentes." },
};

export default function HomePage() {
  return <><HeroSection /><PepCapabilities /><QuickTools /><ContextSection /><FinalChatCta /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]) }} /></>;
}
