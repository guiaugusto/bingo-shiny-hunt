# Bingo Shiny Hunt

React + TypeScript port of the Shiny Bingo Maker prototype: build shiny-hunting bingo boards, track up to 20 of them, mark catches, search by game, roll a random target, and export the board as PNG/SVG. Everything is stored locally in the browser (`localStorage`) — no backend.

## Features

- Up to 20 bingo boards, browsable via a horizontal carousel (add/select/delete).
- Odd grid sizes from 3×3 to 13×13 (so every board has a diagonal).
- Pokémon search backed by the regional dex JSONs from [nerdydrew/Random-Pokemon-Generator](https://github.com/nerdydrew/Random-Pokemon-Generator) — the list is filtered to the game you pick first.
- "Pick a random Pokémon from this game" checkbox for quick random targets.
- Mark cells as caught (green ring + button), edit/remove controls that show on hover (desktop) or long-press (touch).
- Auto-swaps a caught Pokémon's sprite to its region-exclusive form when the chosen game has one (e.g. Legends: Arceus → Hisuian form).
- Game tags colored per-version-pair.
- "Clear board" with a 6-second undo toast.
- Export the current board as a PNG or SVG file.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs static files to `dist/`.

## Deploying to GitHub Pages

This repo ships with `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages **every time `master` is updated** (including merges).

One-time setup in the GitHub repo:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push/merge to `master` — the "Deploy to GitHub Pages" workflow will run automatically and the site will be published at:
   `https://guiaugusto.github.io/bingo-shiny-hunt/`

No further manual steps are needed after that — every merge to `master` triggers a fresh build + deploy.

## Notes

- Sprites and dex data are fetched at runtime from `raw.githubusercontent.com` and cached in `localStorage`, so there's no bundled Pokémon data in this repo.
- Pokémon names, sprites and related data belong to Nintendo/Game Freak/The Pokémon Company; this is a fan-made, non-commercial tool.
