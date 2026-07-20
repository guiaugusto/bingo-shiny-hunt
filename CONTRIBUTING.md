# Contributing to Bingo Shiny Hunt

Thanks for your interest in contributing! This is a small fan-made project, so the process is intentionally lightweight — but a few conventions keep things consistent as more people jump in.

## Getting set up

```bash
npm install
npm run dev
```

The dev server serves the app at `http://localhost:5173/bingo-shiny-hunt/` (the `/bingo-shiny-hunt/` base path matches the GitHub Pages deployment — don't remove it in `vite.config.ts`).

Prefer containers? `docker compose up --build` also works (see `docker-compose.yml`).

To type-check and produce a production build:

```bash
npm run build
```

There's no separate lint or test command yet — `npm run build` (which runs `tsc -b` in strict mode) is the main automated check today. Please make sure it passes before opening a PR.

## Project structure

- `src/components/` — UI components (function components + hooks only)
- `src/hooks/` — state/data hooks (`useBingoStore`, `useDex`)
- `src/lib/` — framework-agnostic helpers (storage, image export, Pokédex fetching, download, slug)
- `src/i18n/` — the `en` / `pt-BR` dictionaries and the `useI18n()` context
- `src/constants.ts` — static game/grid data
- `src/types.ts` — shared TypeScript types

## Code style

There's no linter configured yet, so please match the conventions already in the codebase:

- **TypeScript, strict mode.** Avoid `any` unless truly unavoidable.
- **Function components + hooks.** No class components.
- **Inline `style={{}}` objects** are the established way to style components (not CSS modules, styled-components, or Tailwind) — please stick to it rather than mixing approaches. Things inline styles can't express (resets, `@media` breakpoints, `:hover`/`:focus` states) belong in `src/index.css`.
- **No comments unless they explain a non-obvious *why*** (a workaround, a subtle constraint, a browser quirk). Don't describe *what* the code does — clear naming should already cover that.
- Keep components focused. If one is doing too much, prefer splitting it over growing it further.

## Internationalization

All user-facing text goes through `useI18n()` and the `t` dictionary in `src/i18n/translations.ts` — **except Pokémon names and game names**, which are intentionally left untranslated (they come from external data and are proper nouns).

If you add or change any UI text:

1. Add the key to the `Dictionary` interface in `src/i18n/translations.ts`.
2. Fill it in for **both** `en` and `pt-BR`. If you can't provide one of the two, say so in the PR description so someone can help before it's merged.

## Commit messages

This repo loosely follows [Conventional Commits](https://www.conventionalcommits.org/): `<type>: <short summary>`, imperative mood, lowercase, no trailing period.

Common types used here: `feat`, `fix`, `chore`, `docs`, `refactor`. Example:

```
fix: prevent sprite from overlapping the name/tag row
```

## Before opening a PR

- [ ] `npm run build` passes.
- [ ] You manually tested the change in the browser — there's no automated test suite, so this is the real verification step. Exercise the actual flow you changed, not just "it compiles."
- [ ] If you touched layout or styling, check it at a mobile width (≤720px) as well as desktop — mobile responsiveness is a priority for this project.
- [ ] If you added/changed UI text, both `en` and `pt-BR` are updated.
- [ ] The PR is focused on one change. Unrelated fixes or refactors should be their own PR.

## Reporting bugs / requesting features

Please use the issue templates when opening an issue — they ask for the info that's usually needed to act on a report (steps to reproduce, device/browser, etc.).

## License

By contributing, you agree that your contribution is licensed under the project's [GPL-3.0 license](LICENSE).
