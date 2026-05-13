# CLAUDE.md — Redistricting Game

## Project Overview

An educational interactive web app by **Alabama Forward** that teaches users about gerrymandering and redistricting through hands-on gameplay. Users assign colored dots to districts on a grid to achieve majority goals, learning how district boundaries can be drawn to favor different outcomes.

## Tech Stack

- **TypeScript** (strict mode) — no frontend framework (vanilla JS + SVG)
- **Vite 8** — bundler and dev server
- **GitHub Pages** — hosting via GitHub Actions CI/CD

## Commands

```bash
npm run dev       # Start dev server with hot reload
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
```

## Project Structure

```
src/
├── main.ts        # Entry point — builds page sections, banners, UI chrome
├── game.ts        # GameState class — core game logic (dot assignment, scoring)
├── grid.ts        # createGrid() — renders SVG puzzle grids and handles interaction
├── levels.ts      # Level configs: dot positions, colors, goals, grid dimensions
├── boundary.ts    # computeBoundary() — traces SVG paths around district outlines
├── swiper.ts      # Touch swipe carousel for mobile slide navigation
├── style.css      # All styling (responsive, fonts, colors)
└── assets/        # Images (hero, logo)
public/
├── favicon.svg
└── icons.svg
```

## Architecture

**No framework.** The app is built with vanilla TypeScript, direct DOM manipulation, and inline SVG.

- `main.ts` is the entry point. It constructs the full page: banner, logo, two game sections (each a swipeable carousel of levels), and footer.
- Each level is rendered by `createGrid()` which builds an SVG canvas with clickable dots, district picker buttons, live score feedback, and a reset button.
- `GameState` (class in `game.ts`) manages dot-to-district assignments, enforces per-district size limits, and computes majorities.
- `computeBoundary()` traces the perimeter of each district's assigned dots and produces an SVG `<path>` for the boundary outline.
- `swiper.ts` handles mobile touch navigation between levels within a section.

## Game Mechanics

- Two sections: **Section 1** (3 levels on 5×5 grids, 5 districts) and **Section 2** (3 levels on an Alabama-shaped grid, 7 districts of 16 dots each).
- Dots are orange or green. Users click dots to assign them to the active district.
- Goals vary per level: maximize one party's majorities, or achieve fair representation.
- Level data (dot positions, colors, grid dimensions) is hardcoded in `levels.ts`.

## Key Conventions

- **TypeScript strict mode** — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` all enabled.
- **No test framework** currently installed. Game logic is tested manually.
- **Responsive design**: desktop (≥900px) shows grids side-by-side; mobile (<900px) uses the swiper carousel.
- **Colors**: orange `#f5a623`, green `#8ecb8e`, 7 district colors, primary text `#005067`, accent `#cb0034`.
- **Fonts**: Roboto (body), Roboto Condensed (headings).
- **Vite base path**: `/redistricting_game/` (for GitHub Pages subdirectory deployment).

## Deployment

Automated via `.github/workflows/deploy.yml`. Pushes to `main` trigger a build and deploy to GitHub Pages.
