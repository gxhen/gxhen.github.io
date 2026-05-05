# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm run dev      # Start dev server with Turbopack on http://localhost:3000
npm run build    # Static export to out/ (used by GitHub Pages deployment)
npm run start    # Serve the production build
npm run lint     # Run ESLint (next/core-web-vitals + next/typescript)
```

Requires Node.js >= 22. The `.nvmrc` pins Node 22.

## Architecture

PRISM is a **Next.js App Router** site with **static export** (`output: 'export'` in `next.config.ts`). All content lives in `content/` as TOML, Markdown, and BibTeX files — the code reads them at build time via `fs`; there is no backend or database.

### Routing

- `/` → `src/app/page.tsx` — the homepage. In "one page mode" (`features.enable_one_page_mode` in config), it renders ALL navigation pages inline. Otherwise it shows only the `about.toml` sections.
- `/[slug]` → `src/app/[slug]/page.tsx` — dynamic pages for each navigation entry (except `about`). `generateStaticParams` reads `config.toml` navigation to determine which slugs to generate.

### Content loading (`src/lib/`)

- **`config.ts`** — reads `content/config.toml`. `getConfig(locale?)` loads base config, then merges locale-specific overrides from `content_<locale>/config.toml`. i18n config always comes from the default content directory.
- **`content.ts`** — `getMarkdownContent`, `getBibtexContent`, `getTomlContent`, and `getPageConfig` all follow the same fallback pattern: check `content_<locale>/filename` first, then fall back to `content/filename`.
- **`bibtexParser.ts`** — parses `.bib` files via `bibtex-parse-js`. Handles author highlighting (matching against config author names), LaTeX string cleaning, and year/month sorting. Custom BibTeX fields: `selected`, `preview`, `description`, `keywords`, `code`, `arxiv`.
- **`i18n/`** — locale detection (auto/fixed mode), message bundles (en/zh currently), and the `useMessages` hook.

### Page types

Defined in `src/types/page.ts`:

| Type | TOML key | Behavior |
|------|----------|----------|
| `about` | `sections: [...]` | Mix of markdown, publications, and list sections |
| `publication` | `source: string` | Renders full publication list with search/filter |
| `text` | `source: string` | Renders a single Markdown file |
| `card` | `items: [...]` | Renders card grid (e.g., projects, awards) |

### State & theming

- **Zustand stores** (`src/lib/stores/`) manage theme and locale. Both persist to localStorage.
- **Theme** uses `class` dark mode via Tailwind. A `script` in `layout.tsx` sets the initial class before hydration to avoid flash.
- **Locale** is bootstrapped via an inline script before React mounts, then managed by `LocaleProvider` + `useLocaleStore`. The `data-locale` attribute on `<html>` drives per-locale content switching.

### Component layout

- `src/components/layout/` — Navigation (with mobile menu, locale-aware nav items) and Footer
- `src/components/home/` — Profile, About, News, SelectedPublications, HomePageClient
- `src/components/pages/` — TextPage, CardPage, PublicationsList, DynamicPageClient
- `src/components/ui/` — ThemeProvider, ThemeToggle, LocaleProvider, LanguageToggle

### Tailwind v4 + CSS variables

Despite the `tailwind.config.mjs` file defining custom colors via CSS variables, this project uses Tailwind v4 with the `@tailwindcss/postcss` plugin. The CSS variables (`--background`, `--primary`, etc.) are defined in `src/app/globals.css` and toggle for light/dark via the `.dark` and `.light` classes set on `<html>`.
