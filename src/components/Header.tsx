import { site } from "@/lib/content";
import { LogoMark } from "./Logo";
import { Magnetic } from "./Magnetic";

const NAV = [
  { href: "#services", label: "Услуги" },
  { href: "#cases", label: "Кейсы" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "Вопросы" },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5 font-semibold" aria-label="Под ключ, наверх">
          <LogoMark />
          <span className="font-[family-name:var(--font-display)] text-[15px] tracking-tight">под ключ</span>
        </a>
        <nav aria-label="Разделы" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[15px] text-moss">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="link-underline transition-colors hover:text-cream">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Magnetic>
          <a href={site.telegram.prefill} target="_blank" rel="noopener" className="keybtn keybtn--sm">
            Написать
          </a>
        </Magnetic>
      </div>
    </header>
  );
}
