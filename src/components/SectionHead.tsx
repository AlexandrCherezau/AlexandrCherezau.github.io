import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHead({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="mb-12 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end">
      <h2 id={id} className="h2 md:col-span-7">
        {title}
      </h2>
      {children ? <div className="lead md:col-span-5 md:justify-self-end">{children}</div> : null}
    </Reveal>
  );
}
