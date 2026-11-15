# Источники и лицензии

## 3D
- Клавиша (`public/3d/keycap.glb`): сгенерирована скриптом `scripts/gen-keycap.mjs` в этом репозитории, своя работа. Сжатие: gltf-transform (MIT), meshopt.
- Витой кабель, тёмное ядро шара, расстановка клавиш: процедурная геометрия three.js в коде сайта.
- Освещение: процедурные Lightformer из drei, без HDR-файлов.
- Сторонних моделей нет, поэтому ограничений на коммерческое использование нет.

## Шрифты
- Unbounded, SIL Open Font License 1.1, через Google Fonts / next/font (файлы раздаются с сайта).
- Onest, SIL Open Font License 1.1, через Google Fonts / next/font.
- Атлас символов на клавишах (`public/3d/glyphs.webp`) нарисован шрифтом Unbounded.

## Изображения
- Скриншоты в `public/cases/`: мои собственные проекты (мини-CRM, салон, парсер, RepoOracle, Brest Bus, концепт бота, лендинги кофейни и отеля). Фотографии внутри демо-лендингов сгенерированы нейросетью для этих демо, бизнесы и данные вымышлены.
- Постер и OG-картинка: рендер 3D-сцены этого сайта.

## Библиотеки
Next.js, React, three.js, @react-three/fiber, @react-three/drei, motion, Lenis, Radix UI, Tailwind CSS, clsx: все под MIT.
