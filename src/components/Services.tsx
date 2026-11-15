import { services, servicesNote } from "@/lib/content";
import { formatDays, formatPrice } from "@/lib/format";
import { ArrowIcon, TelegramIcon } from "./Icon";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Services() {
  return (
    <section className="section" aria-labelledby="services-title" id="services">
      <div className="wrap">
        <SectionHead id="services-title" title="Что делаю">
          Шесть направлений, в каждом есть готовый кворк с понятной ценой. Если задача нестандартная, напишите, посчитаю
          отдельно.
        </SectionHead>

        <ul className="border-t border-pine-800">
          {services.map((s, i) => (
            <li key={s.id} className="border-b border-pine-800">
              <Reveal delay={Math.min(i, 3) * 0.04}>
                <article className="group grid gap-5 py-8 transition-colors md:grid-cols-12 md:gap-8 md:py-10">
                  <h3 className="h-display text-[clamp(24px,2.6vw,36px)] md:col-span-4">{s.title}</h3>
                  <ul className="grid gap-1.5 text-[16px] text-cream/85 md:col-span-4">
                    {s.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-enter" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-4 md:col-span-4 md:items-end md:text-right">
                    <dl className="flex gap-8 md:gap-10">
                      <div>
                        <dt className="text-sm text-moss">срок</dt>
                        <dd className="text-lg font-medium">от {formatDays(s.days)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-moss">цена</dt>
                        <dd className="text-lg font-medium">от {formatPrice(s.price)}</dd>
                      </div>
                    </dl>
                    {s.priceNote ? <p className="text-sm text-moss">{s.priceNote}</p> : null}
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <a href={s.kwork} target="_blank" rel="noopener" className="keybtn keybtn--sm">
                        Заказать на Kwork
                        <ArrowIcon />
                      </a>
                      <a
                        href={s.tgUrl}
                        target="_blank"
                        rel="noopener"
                        className="keybtn keybtn--ghost keybtn--sm"
                        aria-label={`Обсудить в Telegram: ${s.title}`}
                      >
                        <TelegramIcon className="h-4 w-4" />
                        Обсудить
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[60ch] text-sm text-moss">{servicesNote}</p>
      </div>
    </section>
  );
}
