# Goose Games

Standalone static arcade for goosegames.dev, adapted from the portfolio's existing cabinet and game artwork.

## Run locally

Use Node 22.13 or newer. Run `npm ci`, then `npm run dev` and open the printed local URL. Run `npm run build` to export the complete site into `out/`.

## Content

The published catalog comes from `https://jakedoesdev.com/api/games` at runtime, so the private **Goose Games catalogue** editor in the portfolio admin is the source of truth. Adding, publishing, or unpublishing a game there updates this site without a GitHub Pages rebuild. `app/data/arcade.ts` is a deliberately baked-in fallback for outages and legacy static `/games/<id>/` pages.

`playUrl` is the direct launch link; `embedUrl` enables the click-to-load player. Only add public game URLs supplied by the creator. Keep unavailable entries clearly marked as previews or archives. Cabinet artwork, media, and canvas presentation originated in the portfolio; no portfolio admin code or private worklog is included here.

## Hosting

GitHub Actions publishes the static `out/` directory to GitHub Pages whenever `main` changes. The production custom domain is `goosegames.dev`; its GitHub Pages domain setting and Cloudflare DNS records are managed separately from the source repository. Game binaries remain hosted at their existing destinations and are embedded or linked from the game pages.

## Validation

Production static export and catalog/asset checks pass. Supplied game URLs return HTTP 200. Browser gameplay, fullscreen, and cross-origin game behavior still need hands-on review across devices. An optional feature-detected WebMCP `set_game_playback` action mirrors the visible Play/Stop controls; it has not been validated in a supported WebMCP browser context.
