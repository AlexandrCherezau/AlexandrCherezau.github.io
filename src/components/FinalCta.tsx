import { site } from "@/lib/content";
import { ArrowIcon, TelegramIcon } from "./Icon";
import { LogoMark } from "./Logo";
import { Magnetic } from "./Magnetic";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-enter text-ink" aria-labelledby="cta-title" id="contact">
      <div className="wrap section grid items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 id="cta-title" className="h-display text-[clamp(38px,6.4vw,92px)] leading-[0.98] tracking-[-0.035em]">
            {site.cta.title}
          </h2>
          <p className="mt-7 max-w-[34em] text-[18px] leading-relaxed text-ink/75">{site.cta.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <a href={site.telegram.prefill} target="_blank" rel="noopener" className="keybtn keybtn--ink">
                <TelegramIcon />
                Написать в Telegram
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.kwork.profile} target="_blank" rel="noopener" className="keybtn keybtn--light">
                Мой Kwork
                <ArrowIcon />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Hanging pass on a lanyard */}
        <div className="relative mx-auto h-[400px] w-[260px] md:col-span-5 md:h-[520px]" aria-hidden>
          <div className="badge-swing absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center md:top-[-170px]">
            <div className="h-[70px] w-3 rounded-b bg-[repeating-linear-gradient(180deg,#0e1613_0_10px,#22302a_10px_20px)] md:h-[240px]" />
            <div className="-mt-1 h-5 w-10 rounded-md bg-[#c9c3b5] shadow-inner" />
            <div className="-mt-1 w-[230px] rounded-[22px] bg-pine-950 p-5 text-cream shadow-[0_30px_60px_-20px_rgba(14,22,19,0.6)]">
              <div className="mx-auto mb-5 h-2.5 w-14 rounded-full bg-pine-800" />
              <div className="grid aspect-square place-items-center rounded-2xl bg-pine-850">
                <LogoMark className="h-24 w-24" />
              </div>
              <p className="mt-5 font-[family-name:var(--font-display)] text-[20px] font-semibold">{site.name}</p>
              <p className="text-sm text-moss">{site.role}</p>
              <p className="mt-4 rounded-lg bg-enter px-3 py-2 text-center text-[15px] font-semibold text-ink">
                {site.telegram.handle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
