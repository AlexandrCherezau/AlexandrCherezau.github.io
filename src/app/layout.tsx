import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import { services, site } from "@/lib/content";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  // Not preloaded: the hero poster is the LCP element and should get the bandwidth first.
  preload: false,
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  // Not preloaded: the hero poster is the LCP element and should get the bandwidth first.
  preload: false,
});

const title = "Под ключ: Telegram-боты, сайты и веб-сервисы | Александр, fullstack-разработчик";
const description =
  "Делаю Telegram-ботов, лендинги, сайты, CRM, парсеры и AI-агентов для малого бизнеса. От задачи до запуска, с исходниками. Рейтинг 5,0 на Kwork.";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Под ключ",
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Под ключ: разработка ботов, сайтов и веб-сервисов" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0e1613",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.siteUrl}/#person`,
      name: site.name,
      jobTitle: site.role,
      url: site.siteUrl,
      sameAs: [site.kwork.profile, site.github, site.telegram.url],
      knowsAbout: ["Telegram-боты", "Next.js", "React", "Python", "FastAPI", "Парсинг", "AI-агенты"],
    },
    ...services.map((s) => ({
      "@type": "Service",
      name: s.title,
      description: s.includes.join(", "),
      provider: { "@id": `${site.siteUrl}/#person` },
      areaServed: "RU",
      offers: {
        "@type": "Offer",
        priceCurrency: "RUB",
        price: s.price,
        url: s.kwork,
      },
    })),
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`}>
      <body>
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
        <script
          type="application/ld+json"
          // JSON.stringify output is safe here: the data is our own static content.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
