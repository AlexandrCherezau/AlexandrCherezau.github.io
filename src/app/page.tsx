import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Cases } from "@/components/Cases";
import { Process } from "@/components/Process";
import { Reviews } from "@/components/Reviews";
import { KworkBlock } from "@/components/KworkBlock";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-enter px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        К содержимому
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Services />
        <Cases />
        <Process />
        <Reviews />
        <KworkBlock />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <SmoothScroll />
      <Cursor />
    </>
  );
}
