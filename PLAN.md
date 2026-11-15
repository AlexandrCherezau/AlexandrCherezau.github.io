# PLAN

| # | Этап | Проверка после этапа |
|---|---|---|
| 1 | Исследование: видео (`tmp/video-notes.md`), проекты (`tmp/projects.md`), отзывы Kwork (`src/content/reviews.json`) | Файлы есть, отзывы сверены с живым профилем |
| 2 | Каркас Next.js 16 + Tailwind 4 + static export, контент JSON | `npm run build` даёт `out/` |
| 3 | Ассеты: GLB клавиши (gltf-transform), атлас глифов, превью кейсов WebP, OG, фавиконки | GLB < 50 КБ, превью < 120 КБ |
| 4 | 3D-сцена hero: сборка по `useProgress`, курсор/наклон/скролл, фолбэки | Браузер, нет ошибок консоли |
| 5 | Секции: услуги, кейсы + модалка, процесс, отзывы, Kwork, FAQ, CTA | Скриншоты 390/768/1440 |
| 6 | Анимации: Lenis, магнитные кнопки, курсор, reduced motion | Эмуляция reduced motion |
| 7 | SEO: metadata, OG, sitemap, robots, JSON-LD | Файлы в `out/` |
| 8 | typecheck, lint, build, ревью ecc:code-reviewer + ecc:react-reviewer, исправить CRITICAL/HIGH | Чистые команды, отчёт ревью |
| 9 | Репозиторий: gitleaks/санитайзер, публичный репо, GitHub Pages через Actions | Сайт открывается по HTTPS |
| 10 | Проверка опубликованного сайта: 390/768/1440, без WebGL, reduced motion, Slow 4G, Lighthouse | `artifacts/screens`, `artifacts/lighthouse/` |
| 11 | Сравнение хостингов (в т.ч. доступность из РФ), подбор имени, второй хостинг при выигрыше | Таблица в отчёте |
| 12 | README.md, CREDITS.md, отчёт `artifacts/REPORT.md` | Файлы готовы |
