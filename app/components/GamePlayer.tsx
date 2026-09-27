"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ArcadeGame } from "../data/arcade";
import styles from "./GamePlayer.module.css";

type ModelTool = { name: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean }; execute: (input: unknown) => Promise<unknown> };
type ModelDocument = Document & { modelContext?: { registerTool: (tool: ModelTool, options: { signal: AbortSignal }) => void | Promise<void> } };

export function GamePlayer({ game }: { game: ArcadeGame }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [notice, setNotice] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  function start() { setLoading(true); setFailed(false); setPlaying(true); }
  function stop() { setPlaying(false); setLoading(false); setFailed(false); }
  useEffect(() => {
    const onFullscreen = () => setFullscreen(document.fullscreenElement === screen.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);
  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => { setLoading(false); setNotice("Taking a while? You can open the game in a new tab below."); }, 15000);
    return () => clearTimeout(timeout);
  }, [loading]);
  useEffect(() => {
    const context = (document as ModelDocument).modelContext;
    if (!game.embedUrl || !context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: "set_game_playback",
        description: `Start or stop the ${game.title} browser game on this page. Starting loads the game's external host.`,
        inputSchema: { type: "object", properties: { action: { type: "string", enum: ["start", "stop"] } }, required: ["action"], additionalProperties: false },
        annotations: { readOnlyHint: false },
        async execute(input) {
          if (!input || typeof input !== "object" || !("action" in input) || !["start", "stop"].includes(String(input.action)) || Object.keys(input).length !== 1) throw new Error("Choose action start or stop.");
          const action = input.action;
          if (action === "start") start(); else stop();
          await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          return { game: game.id, state: action === "start" ? "started" : "stopped" };
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* Standard browsers can use the visible controls. */ }
    return () => lifecycle.abort();
  }, [game.id, game.title, game.embedUrl]);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (screen.current?.requestFullscreen) await screen.current.requestFullscreen();
      else setNotice("Fullscreen is unavailable in this browser. Open the game in a new tab for more space.");
    } catch { setNotice("Fullscreen is unavailable. You can open the game in a new tab."); }
  }

  return <section className={styles.machine} aria-label={`${game.title} player`}>
    <div className={styles.rail}><span><i /> {playing ? "NOW PLAYING" : game.embedUrl ? "READY PLAYER ONE" : "IN THE SHOWCASE"}</span><span>GOOSE GAMES</span></div>
    <div className={styles.screen} ref={screen}>
      <div className={styles.viewport}>
        {playing && game.embedUrl ? <>
          <iframe ref={frame} title={`Play ${game.title}`} src={game.embedUrl} allow="autoplay; fullscreen; gamepad" allowFullScreen sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-downloads" referrerPolicy="strict-origin-when-cross-origin" onLoad={() => { setLoading(false); frame.current?.focus(); }} onError={() => { setLoading(false); setFailed(true); }} />
          {loading && <p className={styles.loading} role="status">Loading {game.title}…</p>}
          {failed && <div className={styles.failure} role="alert"><p>The game couldn’t load here.</p><a href={game.playUrl ?? game.embedUrl} target="_blank" rel="noreferrer">Open the game in a new tab ↗</a></div>}
        </> : <div className={styles.poster}>
          <Image src={game.screenshots[0]?.src ?? game.cover} alt="" fill sizes="(max-width: 900px) 100vw, 75vw" className={styles.backdrop} priority />
          <div><p>{game.genre}</p><h2>{game.title}</h2>{game.embedUrl ? <button onClick={start}><span aria-hidden="true">▶</span> Play game</button> : game.video ? <a href="#gameplay-preview">Watch gameplay ↓</a> : <span className={styles.archive}>FROM THE ARCHIVE</span>}<small>{game.embedUrl ? "Loads when you press play." : game.id === "daho" ? "An idea worth keeping." : "Take a look inside the game."}</small></div>
        </div>}
      </div>
      <div className={styles.controls}><span>{playing ? game.title : "PICK A GAME. MAKE A LITTLE TIME."}</span><div>{playing && <button onClick={stop}>Stop game</button>}<button onClick={toggleFullscreen}>{fullscreen ? "Exit fullscreen ↙" : "Fullscreen ↗"}</button></div></div>
    </div>
    <div className={styles.footnote}>{game.playUrl ? <><p>Game not loading? <a href={game.playUrl} target="_blank" rel="noreferrer">Play in a new tab ↗</a></p><span>Hosted by the game’s creator</span></> : <p>{game.id === "daho" ? "No public browser build available." : "Preview only. Follow the gameplay below."}</p>}</div>
    {notice && <p className={styles.notice} role="status">{notice}</p>}
  </section>;
}
