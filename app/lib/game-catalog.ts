"use client";

import { useEffect, useState } from "react";
import type { ArcadeGame } from "../data/arcade";

const catalogUrl =
  process.env.NEXT_PUBLIC_GOOSE_GAMES_CATALOG_URL ??
  "https://jakedoesdev.com/api/games";
const catalogOrigin = new URL(catalogUrl).origin;

type CatalogResponse = { games?: unknown };

function resolveMediaUrl(value: string): string {
  return value.startsWith("/api/") ? `${catalogOrigin}${value}` : value;
}

function normalizeGame(game: ArcadeGame): ArcadeGame {
  return {
    ...game,
    cover: resolveMediaUrl(game.cover),
    screenshots: game.screenshots.map((screenshot) => ({
      ...screenshot,
      src: resolveMediaUrl(screenshot.src),
    })),
    video: game.video
      ? {
          ...game.video,
          src: resolveMediaUrl(game.video.src),
          externalUrl: resolveMediaUrl(game.video.externalUrl),
        }
      : undefined,
  };
}

/**
 * GitHub Pages serves the interface statically; the published game catalog is
 * fetched from the portfolio Worker so the project manager remains the source
 * of truth between Pages deployments.
 */
export function useGameCatalog(fallback: ArcadeGame[]): ArcadeGame[] {
  const [games, setGames] = useState(fallback);

  useEffect(() => {
    const controller = new AbortController();
    fetch(catalogUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Game catalog unavailable");
        return (await response.json()) as CatalogResponse;
      })
      .then((payload) => {
        // An empty array is meaningful: every game may have been unpublished.
        // Only fall back when the catalog response itself is unavailable/malformed.
        if (Array.isArray(payload.games)) {
          setGames((payload.games as ArcadeGame[]).map(normalizeGame));
        }
      })
      // The baked-in catalog keeps the arcade usable during a transient API outage.
      .catch(() => undefined);
    return () => controller.abort();
  }, [fallback]);

  return games;
}
