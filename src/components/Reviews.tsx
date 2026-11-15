import { reviewStats, reviews, site } from "@/lib/content";
import { ArrowIcon, StarIcon } from "./Icon";
import { SectionHead } from "./SectionHead";

export function Reviews() {
  return (
    <section className="section bg-pine-900" aria-labelledby="reviews-title" id="reviews">
      <div className="wrap">
        <SectionHead id="reviews-title" title="Что пишут заказчики">
          Все отзывы с моего профиля на Kwork, слово в слово, с орфографией авторов.
        </SectionHead>

        <div className="mb-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <div className="flex items-center gap-4">
            <span className="h-display text-[64px] leading-none">{reviewStats.rating.toFixed(1).replace(".", ",")}</span>
            <div>
              <div className="flex gap-0.5 text-enter" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="mt-1 text-sm text-moss">
                {reviewStats.reviews} отзывов, {reviewStats.ordersDone} заказов
                <br />
                {reviewStats.onTime} сдано вовремя, {reviewStats.repeat} повторных
              </p>
            </div>
          </div>
          <a href={site.kwork.profile} target="_blank" rel="noopener" className="keybtn keybtn--ghost keybtn--sm">
            Все отзывы на Kwork
            <ArrowIcon />
          </a>
        </div>

        <ul className="columns-1 gap-5 md:columns-2 xl:columns-3">
          {reviews.map((r, i) => (
            <li key={i} className="mb-5 break-inside-avoid rounded-2xl bg-pine-950 p-6 ring-1 ring-pine-800">
              <blockquote>
                <p className="whitespace-pre-line text-[16px] leading-relaxed text-cream/90">{r.text}</p>
                <footer className="mt-5 flex items-center gap-3 text-sm">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] bg-cream font-semibold uppercase text-ink shadow-[0_2px_0_#c9bfa8]"
                    aria-hidden
                  >
                    {r.author[0]}
                  </span>
                  <span>
                    <span className="block font-medium text-cream">{r.author}</span>
                    <span className="text-moss">
                      {r.service}, {r.dateLabel}
                    </span>
                  </span>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-moss">Даты указаны так, как их показывал Kwork 15 ноября 2026 года.</p>
      </div>
    </section>
  );
}
