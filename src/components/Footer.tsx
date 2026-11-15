import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-pine-950 py-10 text-sm text-moss">
      <div className="wrap flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>
          {site.name}, {site.role.toLowerCase()}. Сайт собран на Next.js и Three.js, 3D-клавиши сделаны процедурно.
        </p>
        <ul className="flex flex-wrap gap-6">
          <li>
            <a className="link-underline hover:text-cream" href={site.telegram.url} target="_blank" rel="noopener">
              Telegram {site.telegram.handle}
            </a>
          </li>
          <li>
            <a className="link-underline hover:text-cream" href={site.kwork.profile} target="_blank" rel="noopener">
              Kwork
            </a>
          </li>
          <li>
            <a className="link-underline hover:text-cream" href={site.github} target="_blank" rel="noopener">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
