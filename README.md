# Goose Games

Standalone static arcade for goosegames.dev, adapted from the portfolio's existing cabinet and game artwork.

## Run locally

Use Node 22.13 or newer. Run `npm ci`, then `npm run dev` and open the printed local URL. Run `npm run build` to export the complete site into `out/`.

## Content

`app/data/arcade.ts` holds the catalog, game destinations, screenshots, and videos. Each entry receives a static `/games/<id>/` page. `playUrl` is the direct launch link; `embedUrl` enables the click-to-load player. Only add public game URLs supplied by the creator. Keep unavailable entries clearly marked as previews or archives.

The portfolio and standalone site currently keep their own copy of the catalog and assets so either can be deployed independently. Update both catalogs when changing game links. Cabinet artwork, media, and canvas presentation originated in the portfolio; no portfolio admin code or private worklog is included here.

## Hosting

This project has its own Sites identity in `.openai/hosting.json`. Only the static `out/` directory is deployed. A private Sites review deployment does not connect or replace goosegames.dev. Custom-domain setup and public access are separate launch steps. Game binaries remain hosted at their existing destinations and are embedded or linked from the game pages.

## Validation

Production static export and catalog/asset checks pass. Supplied game URLs return HTTP 200. Browser gameplay, fullscreen, and cross-origin game behavior still need hands-on review across devices. An optional feature-detected WebMCP `set_game_playback` action mirrors the visible Play/Stop controls; it has not been validated in a supported WebMCP browser context.
