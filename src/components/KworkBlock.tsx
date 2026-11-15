import { kworksTotal, popularKworks, reviewStats, site } from "@/lib/content";
import { formatDays, formatPrice } from "@/lib/format";
import { ArrowIcon } from "./Icon";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";

export function KworkBlock() {
  return (
    <section className="bg-cream text-ink" aria-labelledby="kwork-title" id="kwork">
      <div className="wrap section">
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <h2 id="kwork-title" className="h2">
              Удобнее через Kwork?
            </h2>
            <p className="mt-6 max-w-[34em] text-[18px] leading-relaxed text-ink-soft">
              Там безопасная сделка: деньги резервируются и приходят мне, только когда вы примете работу. У меня{" "}
              {kworksTotal} готовых кворков с фиксированной ценой.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/15 pt-8">
              <div>
                <dt className="text-sm text-ink-soft">рейтинг</dt>
                <dd className="h-display mt-1 text-[clamp(26px,7vw,36px)]">{reviewStats.rating.toFixed(1).replace(".", ",")}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">заказов</dt>
                <dd className="h-display mt-1 text-[clamp(26px,7vw,36px)]">{reviewStats.ordersDone}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">успешно</dt>
                <dd className="h-display mt-1 text-[clamp(26px,7vw,36px)]">{reviewStats.successRate}</dd>
              </div>
            </dl>
            <div className="mt-10">
              <Magnetic>
                <a href={site.kwork.profile} target="_blank" rel="noopener" className="keybtn keybtn--ink">
                  Открыть профиль на Kwork
                  <ArrowIcon />
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <ul className="grid gap-3 md:col-span-7">
            {popularKworks.map((k, i) => (
              <li key={k.url}>
                <Reveal delay={i * 0.05}>
                  <a
                    href={k.url}
                    target="_blank"
                    rel="noopener"
                    className="group flex flex-col gap-4 rounded-2xl bg-[#f7f2e7] p-6 shadow-[0_3px_0_#d6ccb6] ring-1 ring-[#d6ccb6] transition-transform duration-200 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="max-w-[40ch] text-[17px] font-medium leading-snug">{k.title}</span>
                    <span className="flex shrink-0 items-center gap-5">
                      <span className="text-right text-sm text-ink-soft">
                        <span className="block text-[18px] font-semibold text-ink">{formatPrice(k.price)}</span>
                        {formatDays(k.days)}
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-cream transition-colors group-hover:bg-enter group-hover:text-ink">
                        <ArrowIcon />
                      </span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
