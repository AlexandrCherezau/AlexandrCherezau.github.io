import { steps } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Process() {
  return (
    <section className="section" aria-labelledby="process-title">
      <div className="wrap">
        <SectionHead id="process-title" title="Как идёт работа">
          От первого сообщения до запуска пять шагов. На каждом вы знаете, что происходит и что будет дальше.
        </SectionHead>
        <ol className="grid gap-px overflow-hidden rounded-2xl bg-pine-800 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-pine-950">
              <Reveal delay={i * 0.06} className="flex h-full flex-col gap-4 p-6 md:min-h-[300px] md:p-7">
                <span className="grid h-11 w-11 place-items-center rounded-[10px] bg-pine-850 font-[family-name:var(--font-display)] text-[17px] font-semibold text-enter shadow-[0_3px_0_#22302a] ring-1 ring-pine-700">
                  {i + 1}
                </span>
                <h3 className="mt-auto text-[22px] font-semibold">{s.title}</h3>
                <p className="text-[16px] text-cream/75">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
