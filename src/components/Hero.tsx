import { reviewStats, site } from "@/lib/content";
import { HeroStageSlot } from "./hero/HeroStageSlot";
import { Magnetic } from "./Magnetic";
import { TelegramIcon, ArrowIcon } from "./Icon";

export function Hero() {
  return (
    <section
      id="top"
      tabIndex={-1}
      className="relative isolate flex min-h-[100svh] outline-none flex-col overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,#1a2a23_0%,#0e1613_60%)]"
    >
      <div className="wrap relative z-10 flex flex-col pt-[calc(var(--header-h)+20px)] md:pt-[calc(var(--header-h)+48px)] lg:flex-1">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[600px]">
            <h1 className="h-display text-[clamp(30px,3.3vw,50px)] text-balance">{site.hero.title}</h1>
            <p className="lead mt-5 max-w-[28em] md:mt-6">{site.hero.lead}</p>
            <div className="mt-7 flex flex-wrap gap-3 md:mt-9">
              <Magnetic>
                <a href={site.telegram.prefill} target="_blank" rel="noopener" className="keybtn">
                  <TelegramIcon />
                  Обсудить проект
                </a>
              </Magnetic>
              <Magnetic>
                <a href={site.kwork.profile} target="_blank" rel="noopener" className="keybtn keybtn--ghost">
                  Мой Kwork
                  <ArrowIcon />
                </a>
              </Magnetic>
            </div>
            <p className="mt-5 text-sm text-moss lg:hidden">
              Рейтинг {reviewStats.rating.toFixed(1).replace(".", ",")} на Kwork, {reviewStats.ordersDone} заказов сдано
            </p>
          </div>

          <dl className="hidden gap-8 lg:grid lg:pt-2 lg:text-right">
            <div>
              <dt className="text-sm text-moss">рейтинг на Kwork</dt>
              <dd className="h-display text-[56px] font-medium">{reviewStats.rating.toFixed(1).replace(".", ",")}</dd>
            </div>
            <div>
              <dt className="text-sm text-moss">заказов сдано</dt>
              <dd className="h-display text-[56px] font-medium">{reviewStats.ordersDone}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Phone: the 3D sits in its own box under the copy. Desktop: it fills the hero behind the copy. */}
      <HeroStageSlot />

      <div className="pointer-events-none relative z-0 mt-auto select-none overflow-hidden" aria-hidden>
        <div className="h-display translate-y-[18%] whitespace-nowrap text-center text-[13.4vw] leading-[0.8] tracking-[-0.05em] text-cream">
          ПОД КЛЮЧ
        </div>
      </div>
    </section>
  );
}
