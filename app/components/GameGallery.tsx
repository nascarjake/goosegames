"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArcadeGame } from "../data/arcade";
import styles from "./GamePlayer.module.css";

export function GameGallery({ game }: { game: ArcadeGame }) {
  const [selected, setSelected] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  return <>
    {game.screenshots.length > 0 && <section className={styles.gallery} aria-labelledby="screenshots-heading"><p className="eyebrow">A LOOK INSIDE</p><h2 id="screenshots-heading">Screenshots</h2><figure><div className={styles.screenshot}><Image src={game.screenshots[selected].src} alt={game.screenshots[selected].alt} fill sizes="(max-width: 900px) 100vw, 70vw" /></div><figcaption>{game.screenshots[selected].alt}</figcaption></figure>{game.screenshots.length > 1 && <div className={styles.thumbnails}>{game.screenshots.map((shot, index) => <button key={shot.src} onClick={() => setSelected(index)} aria-label={`Show screenshot ${index + 1}: ${shot.alt}`} aria-pressed={index === selected}><Image src={shot.src} alt="" width={160} height={90} /></button>)}</div>}</section>}
    {game.video && <section id="gameplay-preview" className={styles.gallery} aria-labelledby="video-heading"><p className="eyebrow">SEE IT IN MOTION</p><h2 id="video-heading">Gameplay</h2>{game.video.embedNotice ? <div className={styles.videoNotice}><p>{game.video.embedNotice}</p><a href={game.video.externalUrl} target="_blank" rel="noreferrer">Watch on YouTube ↗</a></div> : <div className={styles.video}>{!videoLoaded ? <button onClick={() => setVideoLoaded(true)}>▶ Load gameplay video</button> : game.video.type === "mp4" ? <video controls playsInline autoPlay src={game.video.src} aria-label={`${game.title} gameplay`} onError={() => setVideoLoaded(false)} /> : <iframe title={`${game.title} gameplay`} src={game.video.src} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}</div>}<a className={styles.originalVideo} href={game.video.externalUrl} target="_blank" rel="noreferrer">Open original video ↗</a></section>}
  </>;
}
