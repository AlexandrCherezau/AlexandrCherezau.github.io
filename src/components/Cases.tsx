"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { asset, caseKinds, cases, type CaseItem, type CaseKind } from "@/lib/content";
import { Dialog, DialogContent } from "./ui/dialog";
import { CaseDetail } from "./CaseDetail";
import { SectionHead } from "./SectionHead";
import { ArrowIcon } from "./Icon";

type Filter = CaseKind | "all";

export function Cases() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<CaseItem | null>(null);

  const kinds = useMemo(
    () => (Object.keys(caseKinds) as CaseKind[]).filter((k) => cases.some((c) => c.kind === k)),
    [],
  );
  const visible = filter === "all" ? cases : cases.filter((c) => c.kind === filter);

  return (
    <section className="section bg-pine-900" aria-labelledby="cases-title" id="cases">
      <div className="wrap">
        <SectionHead id="cases-title" title="Работы">
          Реальные проекты и демо с открытым кодом. Демо и концепты подписаны прямо на карточке.
        </SectionHead>

        <div role="group" aria-label="Фильтр по типу" className="-mx-1 mb-10 flex gap-2 overflow-x-auto px-1 pb-2">
          {(["all", ...kinds] as Filter[]).map((k) => {
            const active = filter === k;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(k)}
                className={`h-11 shrink-0 rounded-full px-5 text-[15px] font-medium transition-colors ${
                  active ? "bg-cream text-ink" : "bg-pine-850 text-cream/80 ring-1 ring-pine-700 hover:text-cream hover:ring-moss"
                }`}
              >
                {k === "all" ? "Все" : caseKinds[k]}
              </button>
            );
          })}
        </div>

        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-12" aria-live="polite">
          {visible.map((c, i) => (
            <li
              key={c.id}
              className={
                filter === "all"
                  ? ["xl:col-span-7", "xl:col-span-5", "xl:col-span-5", "xl:col-span-7"][i % 4]
                  : "xl:col-span-6"
              }
            >
              <button
                type="button"
                onClick={() => setOpen(c)}
                className="group block w-full text-left"
                aria-haspopup="dialog"
              >
                <div className="relative overflow-hidden rounded-2xl bg-pine-800 ring-1 ring-pine-700">
                  <Image
                    src={asset(c.cover)}
                    alt=""
                    width={960}
                    height={720}
                    sizes="(min-width: 1280px) 50vw, (min-width: 768px) 50vw, 100vw"
                    className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-pine-950/85 px-3 py-1.5 text-[13px] font-medium text-cream backdrop-blur">
                    {c.status}
                  </span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-moss">{caseKinds[c.kind]}</p>
                    <h3 className="mt-1 text-[22px] font-semibold leading-snug md:text-[24px]">{c.title}</h3>
                    <p className="mt-2 line-clamp-2 max-w-[52ch] text-[16px] text-cream/75">{c.task}</p>
                  </div>
                  <span className="mt-6 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pine-850 ring-1 ring-pine-700 transition-colors group-hover:bg-enter group-hover:text-ink">
                    <ArrowIcon />
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent aria-describedby={undefined}>{open ? <CaseDetail item={open} /> : null}</DialogContent>
      </Dialog>
    </section>
  );
}
