"use client";

import { useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/assets";
import { caseKinds } from "@/lib/cases";
import type { CaseItem } from "@/lib/content";
import { DialogClose, DialogTitle } from "./ui/dialog";
import { ArrowIcon } from "./Icon";

export function CaseDetail({ item }: { item: CaseItem }) {
  const [index, setIndex] = useState(0);
  const img = item.images[index];
  const many = item.images.length > 1;
  const go = (d: number) => setIndex((i) => (i + d + item.images.length) % item.images.length);
  const portrait = img.h > img.w;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <DialogClose
        className="keybtn keybtn--ghost keybtn--sm sticky top-3 z-10 col-span-full -mb-14 mr-3 mt-3 justify-self-end px-4 md:hidden"
        aria-label="Закрыть"
      >
        <CloseIcon />
      </DialogClose>
      <div
        className="relative flex flex-col bg-pine-950 p-4 md:p-6"
        role="group"
        aria-roledescription="галерея"
        aria-label={`Скриншоты: ${item.title}`}
        onKeyDown={(e) => {
          if (!many || e.altKey || e.ctrlKey || e.metaKey) return;
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            go(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <p className="sr-only" aria-live="polite">
          Скриншот {index + 1} из {item.images.length}
        </p>
        <div className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-xl md:min-h-[420px]">
          <Image
            key={img.src}
            src={asset(img.src)}
            alt={img.alt}
            width={img.w}
            height={img.h}
            sizes="(min-width: 768px) 60vw, 100vw"
            className={`h-auto rounded-lg object-contain ${portrait ? "max-h-[62svh] w-auto" : "w-full"}`}
          />
        </div>
        {many && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 gap-2 overflow-x-auto p-1">
              {item.images.map((im, i) => (
                <button
                  key={im.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Показать: ${im.alt}`}
                  aria-pressed={i === index}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition ${
                    i === index ? "ring-enter" : "ring-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={asset(im.src)} alt="" width={160} height={112} loading="lazy" className="h-full w-full object-cover object-top" />
                </button>
              ))}
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => go(-1)} className="keybtn keybtn--ghost keybtn--sm px-4" aria-label="Предыдущий скриншот">
                <ArrowIcon className="h-4 w-4 -rotate-[135deg]" />
              </button>
              <button type="button" onClick={() => go(1)} className="keybtn keybtn--ghost keybtn--sm px-4" aria-label="Следующий скриншот">
                <ArrowIcon className="h-4 w-4 rotate-45" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-moss">
              {caseKinds[item.kind]}, {item.status.toLowerCase()}
            </p>
            <DialogTitle className="mt-1 text-[26px] font-semibold leading-tight">{item.title}</DialogTitle>
          </div>
          <DialogClose className="keybtn keybtn--ghost keybtn--sm hidden shrink-0 px-4 md:inline-flex" aria-label="Закрыть">
            <CloseIcon />
          </DialogClose>
        </div>
        <Block title="Задача">{item.task}</Block>
        <Block title="Решение">{item.solution}</Block>
        <Block title="Результат">{item.result}</Block>
        <div>
          <h3 className="mb-2 text-sm text-moss">Стек</h3>
          <ul className="flex flex-wrap gap-2">
            {item.stack.map((s) => (
              <li key={s} className="rounded-md bg-pine-850 px-2.5 py-1 text-[14px] ring-1 ring-pine-700">
                {s}
              </li>
            ))}
          </ul>
        </div>
        {item.links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {item.links.map((l, i) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener" className={`keybtn keybtn--sm ${i ? "keybtn--ghost" : ""}`}>
                {l.label}
                <ArrowIcon />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 text-sm text-moss">{title}</h3>
      <p className="text-[16px] leading-relaxed text-cream/90">{children}</p>
    </div>
  );
}
