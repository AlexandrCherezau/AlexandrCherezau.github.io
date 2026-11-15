import { faq } from "@/lib/content";
import { SectionHead } from "./SectionHead";

export function Faq() {
  return (
    <section className="section" aria-labelledby="faq-title" id="faq">
      <div className="wrap grid gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionHead id="faq-title" title="Частые вопросы" />
        </div>
        <div className="md:col-span-8">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-pine-800 first:border-t">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[19px] font-medium md:text-[21px] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-pine-850 text-enter ring-1 ring-pine-700 transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[62ch] pb-7 pr-12 text-[17px] leading-relaxed text-cream/80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
